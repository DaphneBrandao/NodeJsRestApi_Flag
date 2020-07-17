const express = require('express'); //call express Js


//IMPORTS
const User = require('../models/user'); 

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authconfig = require ('../config/auth');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

const router = express.Router();

//TOKEN FUNCTION 
function generateToken (params = {}) {
    //secret created in configuration folder - config.json
   return jwt.sign(params, authconfig.secret, {
        //expire date of the token in seconds 
            expiresIn: 86400, 
    });
}

//SIGNUP 
router.post('/signup', async (req, res) => {
    
    const { email, username } = req.body;
    
    //Create a new user
    try {
       //validate if the email already exist
        
        if(await User.findOne({ email }))
        return res.status(400).send('email already exists')
        

        if(await User.findOne({ username }))
        return res.status(400).send('usename already taken')
        
        const newuser = await User.create (req.body);

        //hide the password to not appear when the user is created
        newuser.password = undefined; 
        
        /*Token created in signup because there is not a confirmation e-mail.
        The user will have access to the login imediatly after he is a valid signup */

        return res.send ({ 
          newuser,
          token: generateToken( { id: newuser.id} ) 
        });
    
        } catch (e) {
        return res.status(400).send('oh no! Please try again!')
        
    }
});

//LOGIN
router.post('/login', async(req, res) => {
  
  const { username, password } = req.body;
  //'+password' - to be sure the password referes to the user
  const newuser = await User.findOne({ username }).select('+password');
  //if user not exists
  if(!newuser) 
  return res.status(400).send('Sorry! User not found');
  
  /*VERIFY if the password is from the user
  - await 'cause bcrypt is a promise
  - compare 'cause the password has been hashed*/
  if(!await bcrypt.compare(password, newuser.password))
  return res.status(400).send('Invalid Password!');

  //hide the encrypted password to not appear when the user is created
  newuser.password = undefined; 
      
  /*TOKEN
      -create a unique hash to garantee the token is for my app and not another one
      - created on folder configurations - auth.js 
          const token = jwt.sign({ id: newuser.id }, authConfig.secret, {
              expiresIn: 86400, - expire date of the token in seconds 
          })
      - the token was made in to a function because it will repeat on other routes
  */

  return res.send({
      newuser, 
      token: generateToken({ id: newuser.id }),
  });
   
});


//FORGOTEN PASSWORD - update
router.post('/forgot_password', async(req, res) => {
  //receive user e-mail
  const { email } = req.body;

  try {
    //check if email is on db
    const newuser = await User.findOne({ email });

    if(!newuser)
    return res.status(404).send('User not found');

    /*TOKEN
    Defining a token: / Objective: nobody else can use the link to recover password 
    - using crypto 
    - hexadecimal ('hex') and random with 20 characters
    - expiration time
    */
    const token = crypto.randomBytes(20).toString('hex');
    
    //expire time for token - one hour
    const expireTime = new Date();

    expireTime.setHours(expireTime.getHours() + 1);
    //where to save the token? on the user model at models user.js

    await User.findByIdAndUpdate(newuser.id, {
      //$set - which value will be changed
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: expireTime,
      }
    });
    //console.log(token, expireTime);

    /* NOT WORKING sending email to user
    - import mailer
    - create a template to send to user
    - send a token to user (can't be a link because that is no frontend)
    */
    /*mailer.sendMail({ 
      to: email,
      from: 'daphnebrandao@gmail.com',
      template: 'auth/forgot_password',
      context: { token }, 
      }, (e) => {
      if(e)
      return res.status(400).send('Cannot send forgot password email');
      
      return res.send();
    })*/
    console.log(token, expireTime);
    } catch (e) {
    res.status().send('Failed, try again.')
  }
});

module.exports = router;






/*
GET ONLY ONE ID
router.get('/signup/:id', async(req, res) => {
    const _id = req.params.id; //specifiing what i'm getting, in this case the id

    try {
      const newuser = await User.findById(_id);
  
      if (!newuser) {
        return res.status(404).send();
      }
      res.send(newuser);
    } catch (e) {
      res.status(500).send();
    }
});

//GET VARIOUS ID's
router.get('/signups', async(req, res) => {
    
    
    const _id = req.params.id; //specifiing what i'm getting, in this case the id

    try {
      const newuser = await User.findMany();
  
      if (!newuser) {
        return res.status(404).send();
      }
      res.send(newuser);
    } catch (e) {
      res.status(500).send();
    }
});

//READ
router.patch('/user/:id', async(req, res) => {

});

router.delete('/user/:id', async(req, res) => {

});*/


