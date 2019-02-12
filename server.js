var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Log events.
var morgan = require('morgan');
app.use(morgan('dev'));

var config = require('./src/backend/config');
app.set('superSecret', config.secret);
var mongoose = require('mongoose');
mongoose.connect(config.mongoUri, {useNewUrlParser: true});



app.get('/', function(req, res) {
    res.send('Hey there');
});


var authRouter = require('./src/backend/apis/auth/router');
app.use('/auth', authRouter);
var bookRouter = require('./src/backend/apis/book/router');
app.use('/book', bookRouter);
var userRouter = require('./src/backend/apis/user/router');
app.use('/user', userRouter);


const port = 8888 || process.env.PORT;
var server = app.listen(port, function() {
    console.log('Running on localhost:%s', server.address().port);
});