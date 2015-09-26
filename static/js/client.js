var socket = io.connect();
var username;

var System = React.createClass({

    getInitialState: function (){
        return {
            msg: {
                name: '',
                type: '',
                counts: 0
            }
        }

    },
    componentDidMount: function () {
        var self = this;
        socket.on('system', function (nickname, userCount, type) {
            self.setState({
                msg: {
                    name: nickname,
                    counts: userCount,
                    type: type
                }
            })
        })
    },

    render: function (){
        var message = this.state.msg,
            show = !!message.counts;

        var status = {
            'login': '上线了',
            'logout': '离线了'
        }

        return (
            <div className={show ? '' : 'hidden'}>
                <strong>{message.name}</strong>{status[message.type]}, 在线人数有<i>{message.counts}</i>个
            </div>
        )
    }
})

var Login = React.createClass({
    getInitialState: function (){
        return {
            show: true,
            exited: false
        }
    },

    componentDidMount: function () {
        this.initEvt();

    },
    initEvt: function () {
        var self = this;
        socket.on('nickExited', function (a) {
            self.setState({
                show: true,
                exited: true
            })
        })

        socket.on('loginSucess', function (nickname){
            //调用父级设置用户名的方法
            self.props.setUser(nickname);

            self.setState({
                show: false,
                exited: true
            })
        })
    },

    handleLogin: function () {
        var val = this.refs.nickname.getDOMNode().value;

        socket.emit('login', val);
    },
    render: function (){
        var is_show = this.state.show ? '' : 'hidden',
            is_exited = this.state.exited ? '' : 'hidden';
        return (
            <div className={is_show}>
                <input type="text" placeholder="nickname" ref="nickname" />
                <button onClick={this.handleLogin}>登陆</button>
                <div className={is_exited}>该用户已经存在</div>
            </div>
        )
    }
});

//聊天信息
var ChatList = React.createClass({
    render: function () {
        var chat_list = this.props.data.map(function (item) {
            var _content = item.is_image ? <img width={'50%'} src={item.content} /> :  item.content;
            return (
                <li style={{overflow: 'hidden'}}>
                    <div style={ item.is_self ? {float:'left'} : {float: 'right'}}>
                        <div style={item.is_self ? {color:'#444'} : {color: 'orange'}}>{item.name}</div>
                        <div style={{textIndent: '2em', padding: '5px', background: '#ccc'}}>
                            {_content}
                        </div>
                    </div>
                </li>
            )
        });

        return (
            <ul>
                {chat_list}
            </ul>
        )
    }
})

var Chat = React.createClass({
    getInitialState: function (){
        return {chat_data: []}
    },

    componentDidMount: function () {
        var self = this;

        //接受其他人的消息
        socket.on('newMsg', function (nickname, msg){
            self.handleMsg(nickname, msg, 3);
        })

        //接受图片信息
        socket.on('newImage', function (nickname, msg) {
            console.log(msg);
            self.handleMsg(nickname, msg, 3, 'image');
        })
    },

    handleClick: function() {
        // 用户输入的信息
        var val = this.refs.myTextInput.getDOMNode().value;

        this.handleMsg(username, val, 3);
        //发送当前用户的信息到服务器
        socket.emit('user_msg', val);
    },

    //处理图片上传
    handleUpload: function (e) {
        var target = e.target, self = this;
        if(target.files.length != 0) {
            var file = target.files[0];
            //读取上传文件
            try {
                var reader = new FileReader();

                reader.onload = function (e) {
                    socket.emit('image_msg', e.target.result);
                    self.handleMsg(username, e.target.result, 2, 'image');
                }

                reader.readAsDataURL(file);
            } catch(e) {
                throw e;
            }
        }
    },

    setUser: function (user) {
        username = user;
    },

    /*
    * @interface 处理消息数据
    * @params type {string} 消息类型 =>text，imgage，emoji
    * @params rel {number}  信息来源 => 1 sytstem 2 self 3 other
    * @params content {string} 信息内容
    * @params name {string} 发送人名称
    * */
    handleMsg: function (name, content, rel, type) {

        var temp  = this.state.chat_data.slice(0);

        temp.push({
            is_self: (rel === 2),
            is_system: (rel === 1),
            is_image: ( type && type == 'image'),
            name: name,
            content: content
        })

        this.setState({
            chat_data: temp
        })
    },

    render: function() {

        return (
            <div>
                <Login setUser={this.setUser} />
                <System />
                <ChatList data={this.state.chat_data} />
                <input type="text" ref="myTextInput" />
                <button onClick={this.handleClick}>发送</button>
                <input type="file" rel="imgFile" onChange={this.handleUpload}/>
            </div>
        );
    }
});

React.render(
    <Chat />,
    document.getElementById('content')
);