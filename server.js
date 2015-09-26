var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();

var api = require('./routes/api');

var jade = require('jade');

var blogEngine = require('./blog');

app.set('port', process.env.PORT || 3000);
//设定视图
app.set('views', path.join(__dirname, 'views'));

//设定模版引擎
app.set('views engine', 'jade');

//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.methodOverride());
//app.use(app.router);

app.use(express.static(path.join(__dirname, 'static')));

router.get('/', function (req, res){
    //res.sendfile('./views/index.html');
    res.render('index.jade', {title: '最近文章', entries:blogEngine.getBlogs() })
})

router.get('/article/:id', function (req, res){
    var entry = blogEngine.getBlogDetail(req.params.id);
    res.render('article.jade', {title: entry.title, blog: entry.body});
})

router.get('/api', api.index);

var mong = require('./models/data');
router.get('/con', mong.connect);

//聊天应用
var chat = require('./controller/chat').http(app);
router.get('/chat', function (req, res){
    res.render('chat.jade', {title: '聊天系统'})
});

//指定根目录
app.use('/', router);

chat.listen(app.get('port'));
//app.listen(app.get('port'));