const express = require('express');
const  User = require('../model/student');
const router = new express.Router();
const auth = require('../middleware/auth')
const {studentRegister,studentLogin} = require('../services/studentmodules');
const { update } = require('../model/student');


router.post('/register', studentRegister);

router.post('/login', studentLogin);

router.post('/logout',auth,async(req,res)=>{

try{
 req.user.tokens = req.user.tokens.filter((token)=>{
  return token.token !== req.token;
 });

 await req.user.save();
 res.send({success: true,message:'Logout Successful'});
  }catch(e){
 res.status(500).send();
  }
 });

 router.post('/userprofile',auth, async(req,res)=>{

  try{
   res.send(req.user);
  }catch(e){
  res.status(400).send('Error fetching Profile');
  }
 });

 router.patch('/updateprofile',auth, async(req,res)=>{

 const updates = Object.keys(req.body);
 const allowedUpdates = ['age','firstname','lastname'];

 const isValidOperation = updates.every((update)=>{
   return  allowedUpdates.includes(update);
 });

 if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }


 try{
   updates.forEach((update)=>{
    req.user[update] = req.body[update];
   });

   await req.user.save();
   res.send({success:true})

 }catch(e){
  res.status(400).send(e);
 }
 });

module.exports = router;