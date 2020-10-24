const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({

 firstname: {
  type: String,
  required: true,
  trim: true
 },

 lastname: {
  type: String,
  required: true,
  trim:true
 },

 email : {
   type: String,
   unique: true,
   required: true,
   trim: true,
   lowercase: true,
   validate(value){
     if(!validator.isEmail(value)){
       throw new Error('Email is invalid')
     }
   }
 },

 password : {
  type: String,
  trim: true,
  required: true,
  minlength: 4,
  validate(value){
   if(value.toLowerCase().includes('password')){
     throw new Error('Password cannot contain "password"');
   }
  }
 },

 phonenumber : {
   type: String,
   required: [true, 'Phone number required'],
   unique:true,
   validate: {
    validator: function(value){
      return /\d{3}-\d{3}-\d{4}/.test(value);
    },
    message:  `Phone number not valid`
   },
 },

 city : {
   type: String,
   required: true,
   trim: true
 },

 country : {
   type: String,
   required: true,
   trim : true
 },

 age: {
   type: Number,
   default: 0 ,
   validate(value){
     if(value < 0){
       throw new Error('Age must be a positive number');
     }
   }
 },

company: {
  type: String,
  trim: true
},

school: {
  type: String,
  required: true
},

hometown: {
  type: String,
  trim: true,
},

gender: {
  type: String,
  trim: true,
},

language: {
 type: String,
 requred: true
},

tokens: [{
  token: {
    type: String,
    required: true
  }
}],

avatar: {
  type: Buffer
}

},
{
  timestamps: true
});

UserSchema.methods.toJSON = function(){

 const user = this;

 const userObj = user.toObject();

 delete userObj.password;
 delete userObj.tokens;
 delete userObj.avatar;

 return userObj;

};

UserSchema.methods.generateAuthToken = async function () {

 const user = this;

 const token = jwt.sign({ _id: user._id.toString() },'studentData');

 user.tokens = user.tokens.concat({token: token});

 await user.save();

 return token;

};

UserSchema.statics.findByCredentials = async(email,password) => {

  const user = await User.findOne({email: email});

  if(!user){
    throw new Error('Unable to Login');
  }

  const  isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
    throw new Error('Unable to Login');
  }

  return user;
}; 


UserSchema.pre('save', async function (next) {
  const user = this;
  
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8);
  }

  next();

});


const User = mongoose.model('student', UserSchema);

module.exports = User;