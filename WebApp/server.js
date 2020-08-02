'use strict';
const express = require('express');
const app = express();
const chatConf = require('./app');
const port = process.env.PORT || 3000;
var path = require('path');
const cors = require('cors');
const mailer = require('./app/routes/mailer');


const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));
// app.set('view engine', 'ejs');

app.use("/" , mailer);
app.use('/', chatConf.router);


chatConf.ioServer(app).listen(port, () => {
    console.log('Server Running on Port: ', port);

});

module.exports = { app };