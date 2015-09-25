var mongoose = require('mongoose');

exports.connect = function (req, res) {
    mongoose.connect('mongodb://b527ea90219f47329133d03b86723d9d:60ee770ddeaf40cf84a1f62204176c35@mongo.duapp.com:8908/fGETNMOPQTkRdGliZQML');
    //mongoose.connect('mongodb://localhost/data/db');
    res.send('data')
}

var db = mongoose.connection;

db.on('error', function (data){
    console.log(data);
})

db.on('open', function (){
    console.log('Mongo working');
})