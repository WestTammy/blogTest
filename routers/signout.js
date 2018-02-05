const express = require('express');
const router = express.Router();
const Response = require('../utils/response');

router.get('/', function(req, res, next){
    //清空session中用户信息
    req.session.user = null;
    //返回客户端的信息
    let data = {
        status: 1,
        message: '退出成功！'
    }
    //返回退出结果
    // res.end(JSON.stringify(data));
    Response(res, data);
});

module.exports = router;