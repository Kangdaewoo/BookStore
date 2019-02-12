var router = require('express').Router();
var user = require('./user');


router.post('/login', user.logIn);


module.exports = router;