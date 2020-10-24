const express = require('express');
const  User = require('../model/student');
const router = new express.Router();
const auth = require('../middleware/auth')
const {studentRegister,studentLogin} = require('../services/studentmodules');


router.post('/register', studentRegister);

router.post('/login', studentLogin);

router.post('/logout',auth,async(req,res)=>{

try{
 req.user.tokens = req.user.tokens.filter((token)=>{
  return token.token !== req.token;
 });

 await req.user.save();
 res.send('Logout Successful');
  }catch(e){
 res.status(500).send();
  }
 });

 router.get('/userprofile',auth, async(req,res)=>{

  try{
   res.send(req.user);
  }catch(e){
  res.status(400).send('Error fetching Profile');
  }
 });

module.exports = router;