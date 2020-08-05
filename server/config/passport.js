const passport = require('passport');

//strategy
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');


//external constants 
const { JWT_SECRET, 
      GOOGLE_CLIENT_ID, 
      GOOGLE_CLIENT_SECRET,
      FACEBOOK_APP_ID,
      FACEBOOK_APP_SECRET } = process.env;

//get user model      
const User = require('../models/User'); 

/**
 * get the token from the cookie
 * 
 * @param {req} req - information of the request that the client made
 * @returns token - token obtained
 */
const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
}


/**
 * Json Web Tokens Strategy - authentication check
 * 
 * @param {Object} jwtFromRequest - header to receive
 * @param {String} secretOrKey - secret text added when the token was generated
 * @param {boolean} passReqToCallback - true, to get req
 * @param {Object} req - information of the request that the client made
 * @param {object} payload - information stored in the token
 * @param {Function} done - callback
 */

passport.use(new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    req.user = user;

    //continue
    done(null, user);

  } catch(error) { done(error, false); }
}));


/**
 * Google OAuth Strategy - authentication check
 * 
 * @param {String} clientID - Google credentials
 * @param {String} clientSecret - Google credentials
 * @param {boolean} passReqToCallback - true, to get req
 * @param {Object} req - information of the request that the client made
 * @param {String} accessToken - token from google
 * @param {String} refreshToken - renewed token from google
 * @param {Object} profile - user data from google
 * @param {Function} done - callback
 */

passport.use('googleToken', new GoogleTokenStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Could get accessed in two ways:
      // 1) When registering for the first time
      // 2) When linking account to the existing one

      // should have full user profile over here
  
      if (req.user) {
        // if user is already logged in, add linking account
        // add Google's data to an existing account
        req.user.methods.push('google')
        req.user.google = {
          id: profile.id,
          email: profile.emails[0].value
        }
        //save user
        await req.user.save()
        //return user
        return done(null, req.user);
      } 
      else {
        //account creation process
        
        //find the user id in database
        let existingUser = await User.findOne({ "google.id": profile.id });

        //if the user is already in database, just return it
        if (existingUser) return done(null, existingUser);
          
        // Check if there is someone with the same email
        existingUser = await User.findOne({ "local.email": profile.emails[0].value })

        //if the email already exists, merge google's data with local auth
        if (existingUser) {
          //user configuration
          existingUser.methods.push('google')
          existingUser.google = {
            id: profile.id,
            email: profile.emails[0].value
          }
          //save user
          await existingUser.save()
          //return user
          return done(null, existingUser);
        }
              
        //if user id/email does not exist, just create a new one
        //configurate user
        const newUser = new User({
          methods: ['google'],
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        });
  
        //save user in db
        await newUser.save();

        //continue with the proccess with  null errors and the newUser
        done(null, newUser);
      }

    } catch(error) {
      done(error, false, error.message);
    }
}));


/**
 * Facebook OAuth Strategy - authentication check
 * 
 * @param {String} clientID - Facebook credentials
 * @param {String} clientSecret - Facebook credentials
 * @param {boolean} passReqToCallback - true, to get req
 * @param {Object} req - information of the request that the client made
 * @param {String} accessToken - token from facebook
 * @param {String} refreshToken - renewed token from facebook
 * @param {Object} profile - user data from facebook
 * @param {Function} done - callback
 */
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {

    // Could get accessed in two ways:
    // 1) When registering for the first time
    // 2) When linking account to the existing one

    // should have full user profile over here

    /*console.log('profile', profile);
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);*/
    
    if (req.user) {
      // if user is already logged in, add linking account
      // add Facebook's data to an existing account
      req.user.methods.push('facebook')
      req.user.facebook = {
        id: profile.id,
        email: profile.emails[0].value
      }
      //save in database
      await req.user.save();

      //return user
      return done(null, req.user);

    } else {
      // account creation process

      //try to find user in database
      let existingUser = await User.findOne({ "facebook.id": profile.id });

      //if the user is already in database, just return it
      if (existingUser) return done(null, existingUser);
      
      //check if someone has the same email
      existingUser = await User.findOne({ "local.email": profile.emails[0].value })

      //if the email already exists, merge facebook's data with local auth
      if (existingUser) {
        
        existingUser.methods.push('facebook')
        existingUser.facebook = {
          id: profile.id,
          email: profile.emails[0].value
        }
        //save user
        await existingUser.save()
        //return user
        return done(null, existingUser);
      }

      //if user id/email does not exist, just create a new one
      //configurate user
      const newUser = new User({
        methods: ['facebook'],
        facebook: {
          id: profile.id,
          email: profile.emails[0].value
        }
      });
      //save user
      await newUser.save();
      //continue
      done(null, newUser);
    }
  } catch(error) { done(error, false, error.message); }
}));

/**
 * local strategy - authentication check
 * 
 * @param {String} usernameField - field used to get the user
 * @param {String} email - req parameter
 * @param {String} password - req parameter
 * @param {Function} done - callback
 */
passport.use(new LocalStrategy({

    usernameField: 'email'  

  }, async (email, password, done) => {
    
    try {
        // find user email
        const findUser = await User.findOne({ "local.email": email });

        //if user does not exist, handle it
        if (!findUser) return done(null, false);
    
        // Match user password
        const match = await findUser.matchPassword(password);

        //if the password is not correct, handle it
        if(!match) return done(null, false);
            
        //otherwise return the user
        return done(null, findUser);   

    } catch (error) { done(error, false); }
}));