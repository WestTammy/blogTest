const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/users');
const Response = require('../utils/response');
//用户登录
router.post('/', function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;
    let data = {};
    try{
        //成功
        UserModel.getUserByName(username)
        .then(function(user){
            if(!user){
                data = {
                    status: 2,
                    message: '用户名不存在！'
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
            } else if(sha1(password) !== user.password){//密码检查
                data = {
                    status: 2,
                    message: '输入的密码有误！'
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
            }
            //登入成功
            delete user.password;
            req.session.user = user;
            //返回成功的结果
            data = {
                status: 1,
                message: '登录成功',
                data:req.session.user
            }
            Response(res, data);
            // res.end(JSON.stringify(data));
        }).catch(function(e){
            data = {
                status: 2,
                message: '服务器出错了！',
                data: e
            }
            Response(res, data);
            // res.end(JSON.stringify(data));
            next(e);
        })
        
    } catch(e){
        //失败
        data = {
            status: 2,
            message: '服务器出错了！',
            data: e
        }
        Response(res, data);
        // res.end(JSON.stringify(data));
    }
});

module.exports = router;