// module.exports = function(app){
//     // app.get('/', function(req, res){
//     //     res.send('hello, express');
//     // });
//     //路由入口
//     let dataSuccess = {
//         status: '100', 
//         msg: '登录成功',
//         data: {
//             userId: '20170113',
//             userName: 'hgdqstudio',
//             blog: 'http://hgdqstudio.online'
//         }
//     };
//     app.post('/signup', function(req, res, next){
//         console.log(req.body);
//         let phone = req.body.phone;
//         let username = req.body.username;
//         // console.log(req, res)
//         // res.send(phone+',' + username);
//         res.end(JSON.stringify(dataSuccess))
//     })
// }

module.exports = function(app){
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin')); 
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));
    app.use('/comments', require('./comments'));
    app.use(function(req, res){
        console.log('>>>>>>>>>>'+ res.headersSent)
       
        if(!res.headersSent){
           
            res.status(404).render('404')
        }
    })
}