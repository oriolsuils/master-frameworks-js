'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true }).then(() => {
    console.log('Database connection success');

    //Load server and listen HTTP requests
    app.listen(port, () => {

    });
});