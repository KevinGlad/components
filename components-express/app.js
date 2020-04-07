const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./db/mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
require('./bin/strategies/googleOauth2')
const passport = require('passport')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiUsersRouter = require('./routes/api/v1/apiusers')
const reactRouter = require('./routes/react')

const app = express();

db.connect(app.locals)
  .then(dbConnection => {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(cors())
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(fileUpload()) 
    app.use(cookieParser());
    
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'react')));

    app.use(passport.initialize());
    
    //app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/api/v1/users', apiUsersRouter)
    app.use('/', reactRouter)
    
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

    process.on("SIGINT",() => {
      db.close()
      process.exit()
    })
  })
  .catch(error => {
    console.log(error)
  })
module.exports = app;
