const userCtrl = {};
const { JWT_SECRET } = process.env;

// Models
const User = require('../models/User');

// Modules
const jwt = require('jsonwebtoken');

/**
 * generate token to the current user (header + payload + signature)
 * 
 * @param user - id of the current user
 * @param iss - to sign, describe who created the jwt
 * @param sub - to sign, user id to limit the use
 * @param iat - to sign, describe when it was created (current time)
 * @param exp - to sign, expiration date, current time + 1 day
 * @param JWT_SECRET - to sign, secret key
 * @return token generated
 */
signToken = user => {
   // console.log(user);
    const token = jwt.sign({
        iss:'authjwt',
        sub: user, 
        iat: new Date().getTime(), 
        exp: new Date().getTime() + 1, 
    }, JWT_SECRET);
   // console.log(token);
    return token;
}

/**
 * Register an user if parameters are accepted
 * 
 * @param {object} req - information of the request that the client made 
 * @param {object} res - to respond to HTTP requests
 */
userCtrl.signUp = async (req, res) => {
 
    //get parameters from request
    const { name, email, password } = req.value.body;

    //try to find the user email with the local method
    let findEmail = await User.findOne({ "local.email": email });

    //check that email does not exist
    if (findEmail) return res.status(403).json({ error : "Email is already in use."});

    //check if there is a Google/Facebook account with the same email
    findEmail = await User.findOne({ 
        $or: [
          { "google.email": email },
          { "facebook.email": email },
        ] 
    });

    //if there is a Google/Facebook account with the same email
    //just merge them
    if (findEmail) {
        //configurate user
        findEmail.methods.push('local')
        findEmail.local = {
          email: email, 
          password: password
        }
        //save it in database
        await findEmail.save()
        //generate the token
        const token = signToken(findEmail);

        // send a cookie containing JWT
        res.cookie('access_token', token, {
          httpOnly: true,
         /* SameSite: 'None', 
          secure: true */
        });
        //response success
        return res.status(200).json({ success: true });
    }
    
    //in case the email does not exist in the database,
    //create new user with the User model 
    const newUser = new User({ 
        methods: ['local'],
        local: {
          name: name, 
          email: email, 
          password: password
        }
    });
  
    //encrypt password with bcryptjs
    //register the new user
    await newUser.save();

    // generate token
    const token = signToken(newUser.id);

    // send a cookie containing JWT
    res.cookie('access_token', token, {
      httpOnly: true,
      /*SameSite: 'None', 
      secure: true */
    });
    //reponse json success
    res.status(200).json({ success: true });

}

/**
 * login user if form parameters are accepted
 * 
 * @param {object} req - information of the request that the client made
 * @param {object} res - to respond to HTTP requests
 */
userCtrl.signIn = async (req, res) => {

  //console.log(req.user.id);

    //generate token
    const token = signToken(req.user.id);

    //send a cookie containing JWT
    res.cookie('access_token', token, {
        httpOnly: true,
        //SameSite:'None',
        //response_mode:form_post,
        //secure: true 
    });
    
    //response success
    res.status(200).json({ success: true });

}

/**
 * Log out the user 
 * 
 * @param {object} req - information of the request that the client made
 * @param {object} res - to respond to HTTP requests
 */
userCtrl.signOut = (req, res) => {

 // console.log('example enter');

    //clear cookie
    res.clearCookie('access_token');

    //reponse success
    res.json({ success: true });
};

/**
  * generate the token if it was logged/registered by google
  * 
  * @param {object} req - information of the request that the client made
  * @param {object} res - to respond to HTTP requests
  */
userCtrl.googleOAuth = async (req, res) => {
    // Generate token
    const token = signToken(req.user.id);
    //send a cookie containing JWT
    res.cookie('access_token', token, {
      httpOnly: true,
      /*SameSite:'None',
      secure: true */
    });
    //reponse success
    res.status(200).json({ success: true });
};

/**
  * if the google account was linked to the local account,
  * respond a json with the methods, a message and a success
  * 
  * @param {object} req - information of the request that the client made
  * @param {object} res - to respond to HTTP requests
  */
userCtrl.linkGoogle = async (req, res) => {
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully linked account with Google' 
    });
};

/**
  * unlink the google account from the local account,
  * respond a json with the methods, a message and a success
  * 
  * @param {object} req - information of the request that the client made
  * @param {object} res - to respond to HTTP requests
  */
userCtrl.unlinkGoogle = async (req, res) => {

    //delete Google sub-object
    if (req.user.google) {
      req.user.google = undefined
    }
    //remove 'google' from methods array
    const googleStrPos = req.user.methods.indexOf('google')
    if (googleStrPos >= 0) {
      req.user.methods.splice(googleStrPos, 1)
    }
    //update database
    await req.user.save()

    //response
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Google' 
    });
};

/**
  * generate the token if it was logged/registered by facebook
  * 
  * @param {object} req - information of the request that the client made
  * @param {object} res - to respond to HTTP requests
  */
userCtrl.facebookOAuth = async (req, res) => {

    //generate token
    const token = signToken(req.user.id);
    //send a cookie containing JWT
    res.cookie('access_token', token, {
      httpOnly: true,
      /*SameSite:'None',
      secure: true */
    });
    //response success
    res.status(200).json({ success: true });
};

/**
  * if the facebook account was linked to the local account,
  * respond a json with the methods, a message and a success
  * 
  * @param {object} req - information of the request that the client made
  * @param {object} res - to respond to HTTP requests
  */
userCtrl.linkFacebook = async (req, res) => {
    res.json({ 
      success: true, 
      methods: req.user.methods, 
      message: 'Successfully linked account with Facebook' 
    });
};

/**
  * unlink the facebook account from the local account,
  * respond a json with the methods, a message and a success
  * 
  * @param {object} req - information of the request that the client made
  * @param {object} res - to respond to HTTP requests
  */
userCtrl.unlinkFacebook = async (req, res) => {

    //delete Facebook sub-object
    if (req.user.facebook) {
      req.user.facebook = undefined
    }

    //remove 'facebook' from methods array
    const facebookStrPos = req.user.methods.indexOf('facebook')
    if (facebookStrPos >= 0) {
      req.user.methods.splice(facebookStrPos, 1)
    }

    //update database
    await req.user.save()

    //response
    res.json({ 
      success: true,
      methods: req.user.methods, 
      message: 'Successfully unlinked account from Facebook' 
    });
};

/**
  * respond a json with methods and secret
  * 
  * @param {object} req - information of the request that the client made
  * @param {object} res - to respond to HTTP requests
  */
userCtrl.dashboard = async (req, res) => {

    res.json({ 
      secret: "resource",
      methods: req.user.methods
    });
};

/**
  * to check if the user is authenticated,
  * response success
  * 
  * @param {object} req - information of the request that the client made
  * @param {object} res - to respond to HTTP requests
  */
userCtrl.checkAuth = async (req, res) => {
   // console.log('I managed to get here!');
    res.json({ success: true });
};


//export the module
module.exports = userCtrl;