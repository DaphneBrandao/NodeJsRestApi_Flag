//IMPORTS

const express = require('express');
const middleware = require('../middleware/auth');

const router = express.Router();


router.use(middleware);

//MIDDLEWARE
router.get('/', (req, res) => {
    res.send({ 
        ok: true, 
        User:  req.newuserId 
    });
});

module.exports = project => project.use('/middleware', router);