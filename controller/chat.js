//保存用户数据
var users = [];

exports.http = function (app){
    var http = require('http').Server(app);
    var io = require('socket.io')(http);


    io.on('connection', function(socket){
        //socket 表示当前连接到服务器的客服端
        console.log('a user connection');

        socket.on('login', function (nickname){
            if(users.indexOf(nickname) > -1) {
                socket.emit('nickExited');
            } else {
                socket.userIndex = users.length;
                socket.nickname = nickname;

                users.push(nickname);

                socket.emit('loginSucess', nickname);

                //向所有连接到服务器的客户端发送当前用昵称
                io.sockets.emit('system', nickname, users.length, 'login');
            }
        })
        //用户离开房间
        socket.on('disconnect', function (){
            users.splice(socket.userIndex, 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        })

        //监听用户发送的信息
        socket.on('user_msg', function (data){
            socket.broadcast.emit('newMsg', socket.nickname, data);
        })

        //监听用户发送的图片
        socket.on('image_msg', function (data){
            socket.broadcast.emit('newImage', socket.nickname, data);
        })
    });

    return http;
};


