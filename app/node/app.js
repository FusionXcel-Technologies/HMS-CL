var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ApiRouter = require('./apps/routes');
const cors = require('cors');
require('dotenv').config();


var app = express();

app.use(cors()); // Enable CORS for all routes  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join('./frontend/angular/dist/angular')));
app.get('/', (req, res) => {
  res.sendFile("index.html", {
    root: "./frontend/angular/dist/angular",
  });
});

//require('./apps/routes')(app)
app.use('/api', ApiRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;


