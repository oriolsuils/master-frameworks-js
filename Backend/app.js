'use strict'

// Load node modules to create backend server
var express = require('express');
var bodyParser = require('body-parser');

// Execute Express
var app = express();

// Load routes
var articleRoutes = require('./routes/article');

// Middlewares
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Add prefix to paths
app.use('/api', articleRoutes);

// Export module
module.exports = app;