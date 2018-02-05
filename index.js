const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('config-lite')(__dirname);
const routers = require('./routers');
const pkg = require('./package');
const winston = require('winston');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const app = express();

//设置模板目录
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎ejs
app.set('view engine', 'ejs');
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//session 中间件
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("*", function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
   
});

//正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new(winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}))

//路由
routers(app);

//错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}))

app.listen(config.port, function(){
    console.log(`${pkg.name} listening on port ${config.port}` )
});