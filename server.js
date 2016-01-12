var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    files = require('./files'),
    mongoose = require('mongoose');

require('dotenv').config({path: __dirname+'/.env'});

var app = express();

mongoose.connect('mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST+'/'+process.env.MONGO_DB+'');

app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.raw({"type": "text/plain", "limit": '50mb'}));

app.get('/file/:id',files.get);
app.post('/file',files.post);


app.listen(process.env.API_PORT);
console.log('Listening on port '+process.env.API_PORT+'...');