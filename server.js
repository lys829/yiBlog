var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();

var api = require('./routes/api');

var jade = require('jade');

var blogEngine = require('./blog');

/*http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>Node.js</h1>');
    res.end('<p>Hello World</p>');
}).listen(port);*/
//console.log(__dirname, process.env);
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

//指定根目录
app.use('/', router);

app.listen(app.get('port'));