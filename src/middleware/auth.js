//IMPORTS
const jwt = require('jsonwebtoken');
const authconfig = require('../config/auth.json');

//MODULES
//const UserSchema = require('./modules/user'); 
/*
- next - is called is the user is ready to go to the controller
- we can test if the token is correct before the user logins in to the app
*/

module.exports = (req, res, next) => {
    //get header autorization
    const authHeader = req.headers.authorization;
   
    //check if token was informed
    if(!authHeader)
    return res.status(401).send( 'No token provided' );
   
    /* check of the token has a good format, should be Bearer + hash
        - divide in 2 partes */
    
    const parts = authHeader.split(' ');

   if(!parts.length === 2)
    return res.status(401).send('Token error');
    
    //Token receives 2 parts
    const [ scheme, token ] = parts;

    /*check if schema starts with bearer:
        - rex:
        $ final 
        i case insitive*/
    
    if(!/^Bearer$/i.test(scheme))
    return res.status(401).send('Token with bad format')
    

   //check if token is according with the token secret - using the jwt and authconfig 
    jwt.verify(token, authconfig.secret, (e, decoded ) => {
    if(e) 
    return res.status(401).send( 'Invalid Token');
        
    req.newuserId = decoded.id; 
    return next();  
    
    });
};
 