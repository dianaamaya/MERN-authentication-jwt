const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * create user schema, handle 3 methods (google, facebook, local)
 */
const UserSchema = new Schema({
  methods: {
    type: [String],
    required: true
  },
  local:{
    name: { type: String },
    email: { type: String, lowercase:true },
    password: { type: String }
  },
  google:{
    id: {type: String},
    email: {type: String, lowercase:true}
  },
  facebook: {
    id: {type: String},
    email: {type: String, lowercase:true}
  },
  
});

/**
 * before saving the user in the database, encrypt the password
 */
UserSchema.pre('save', async function (next) {
  try {

    //it should be the local strategy
    if (!this.methods.includes('local')) {
      next();
    }

    //the user schema is instantiated
    const user = this;

    //check if the user has been modified to know if the password has already been hashed
    if (!user.isModified('local.password')) {
      next();
    }

    // generate a salt
    const salt = await bcrypt.genSalt(10);

    // encrypt password
    const passwordEncrypt = await bcrypt.hash(this.local.password, salt);

    // set the encrypt password
    this.local.password = passwordEncrypt;
  
    //continue executing the code
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * check if the passwords match
 * 
 * @param {String} password - to compare with password in database
 * @returns {boolean} - true, if passwords match - false, in other case
 */
UserSchema.methods.matchPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.local.password);
  } catch (error) {
    throw new Error(error);
  }  
};

//set schema, create and export user model
module.exports = model("User", UserSchema);