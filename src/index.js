//IMPORTS
const express = require('express'); //call express Js
require('./db/mongoose');//connection to database

//ROUTES
const userRouter = require('./Router/user');
const commentsRouter = require('./Router/comments');

const middleware = require('./middleware/auth');

//ASSIgns
const port = 3000;
const project = express(); //assign express to project 

const router = express.Router();


//Controllers
require('./controllers/middlewarecontroller')(project);


//MODELS
const UserSchema = require('./models/user');  //call user module

router.use(middleware);

//IMPORT MODELS TO DATABASE WITH JASON LANGUAGE/ CREATING ROUTE /USERS
project.use(express.json());

project.use(userRouter);
project.use(commentsRouter);

project.listen (port, () => {
    console.log("server is up on port" + port);
});

