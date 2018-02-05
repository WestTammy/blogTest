const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const Response = require('../utils/response');
const UserModel = require('../models/users');


router.post('/', function(req, res, next){
    const username = req.body.username;
    //密码需要加密
    let password = req.body.password;
    const repassword = req.body.repassword;

    //返回到客户端的数据
    let data = {status: 1}
    // res.end(JSON.stringify(data));
    //校验参数
    try{
        //明文密码加密
        password = sha1(password);
        //待写入数据库的用户信息
        let user = {
            name: username,
            password: password
        };
        //用户信息写入数据库
        UserModel.create(user).then(function(result){
            //此user是插入mongodb后的值,包含_id
            user = result.ops[0];
            delete user.password;
            req.session.user = user;
            //返回注册成功的结果
            data = {
                status: 1,
                message: '注册成功',
                data: req.session.user
            }
            Response(res, data);
            // res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
            // res.end(JSON.stringify(data));
        }).catch(function(e){
            //用户名被占用
            data = {
                status: 2,
                message: '用户名已被占用！',
                data: e
            }
            Response(res, data);
            // res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
            // res.end(JSON.stringify(data));
            next(e);
        })
    }catch(e){
        //注册失败
        data = {
            status: 2,
            message: '服务器出错了！'
        }
        Response(res, data);
        // res.end(JSON.stringify(data));
    }
    
})

module.exports = router;