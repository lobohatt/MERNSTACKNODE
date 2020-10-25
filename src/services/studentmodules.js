const User = require('../model/student');


exports.studentRegister = async(req,res)=>{

  const user = new User(req.body);

try {
     await user.save();
     const token = await user.generateAuthToken();
     res.status(201).send({user,token, success: true});
}catch(e){
     res.status(400).send(e);
}

};

exports.studentLogin = async(req,res)=>{

 try {
  const user = await User.findByCredentials(req.body.email,req.body.password);
  const token = await user.generateAuthToken();
  res.send({user: user, token: token, success: true});
 }catch(e){
  res.status(400).send();
 }

};


