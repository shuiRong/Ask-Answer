const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');


//const index = require('./routes/index');
const door = require('./routes/door');
const question = require('./routes/question');
const login = require('./routes/api/login');
const logout = require('./routes/api/logout')
const signup = require('./routes/api/signup');
const newquestion = require('./routes/api/newquestion');
const newanswer = require('./routes/api/newanswer');
const getuserquestion = require('./routes/api/getuserquestion');
const getuseranswer = require('./routes/api/getuseranswer');
const getquestion = require('./routes/api/getquestion');
const getanswers = require('./routes/api/getanswers');
const changescore = require('./routes/api/changescore');
const updateanswer = require('./routes/api/updateanswer');
const getuserinfo = require('./routes/api/getuserinfo');
const gettags = require('./routes/api/gettags');
const useredit = require('./routes/api/useredit');
const users = require('./routes/users');
const sendemail = require('./routes/api/sendemail');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//session 里的设置
app.set('trust proxy',1); //生产模式下是用

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//全局的路由都可以访问到
app.use(session({
    secret: '*mF.13%2Fs_&S*8d:`^&', //加密sessionId用
    name: 'sessionId',
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7,httpOnly: true}  //其中的sessionId的失效时间
  })
);


//公共静态文件夹
app.use(express.static(path.join(__dirname,('public'))));
app.use(express.static(path.join(__dirname,('routes'))));
app.use(express.static(path.join(__dirname,('uploads'))));

app.use('/', door);
app.use('/door',door);
app.use('/question/*',question);
app.use('/api/login',login);
app.use('/api/signup',signup);
app.use('/api/logout',logout);
app.use('/api/newquestion',newquestion);
app.use('/api/getuserquestion',getuserquestion);
app.use('/api/getuseranswer',getuseranswer);
app.use('/api/getquestion',getquestion);
app.use('/api/getanswers',getanswers);
app.use('/api/getuserinfo',getuserinfo);
app.use('/api/changescore',changescore);
app.use('/api/newanswer',newanswer);
app.use('/api/updateanswer',updateanswer);
app.use('/api/gettags',gettags);
app.use('/api/useredit',useredit);
app.use('/users/*',users); //个人主页
app.use('/api/sendemail',sendemail);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
