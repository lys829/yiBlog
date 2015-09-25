var entries = [
    {id: 1, title: 'first', body: 'content1', time: new Date()},
    {id: 2, title: 'second', body: 'content2', time: new Date()},
    {id: 3, title: 'third', body: 'content3', time: new Date()},
    {id: 4, title: 'fouth', body: 'content4', time: new Date()}
]

exports.getBlogs = function (){
    return entries;
}

exports.getBlogDetail = function (id){
    for(var i=0; i < entries.length; i++) {
        if(entries[i].id == id) {
            return entries[i];
        }
    }
}