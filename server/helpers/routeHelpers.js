const routeHelper = {};
const joi = require('@hapi/joi');

/**
 * predefined scheme for the registration form
 */
routeHelper.schemaSignUp = joi.object().keys({
    name: joi.string()
        .required(),
    
    email: joi.string().email()
        .required(),

    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .min(4),

    repeat_password: joi.ref('password'),
    
});

/**
 * predefined scheme for the login form
 */
routeHelper.schemaSignIn = joi.object().keys({
    
    email: joi.string().email()
        .required(),

    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .min(4),
    
});

/**
 * validates the parameters sent by the user when logging in or registering
 * 
 * @param {Object} schema - one of the two previously defined validation schemes
 *                          (schemaSignUp / schemaSignIn)
 */
routeHelper.validateBody  = (schema) => {

    return (req, res, next) => {

       //check parameters in req.body
       const result = schema.validate(req.body);
       
       //check if there are arrors
       //console.log(result.error.details[0].message);
       if(result.error){           
        return res.status(400).json({error:result.error.details[0].message});
       }    

       //clean and set the value in the object
       if(!req.value){ req.value = {}; }
       req.value['body'] = result.value;

       //continue
       next();
    }  
      
}

//export route helpers
module.exports = routeHelper;