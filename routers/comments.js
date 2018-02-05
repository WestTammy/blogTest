const CommentModel = require('../models/comments');
const express = require('express');
const router = express.Router();
const Response = require('../utils/response');

//创建一条留言
router.post('/update', function(req, res, next){
    // res.send('创建留言');
    const author = req.session.user._id;
    const postId = req.params.id;
    const content = req.params.content;
    let data = {};

    //参数校验
    try{
        const comment = {
            author: author,
            postId: postId,
            content: content
        }
        CommentModel.create(comment)
        .then(function(){
            data = {
                status: 1,
                message: '留言成功！'
            };
            Response(res, data);
            // res.end(JSON.stringify(data));
        }).catch(function(e){
            data = {
                status: 2,
                message: '数据出错了'
            };
            // res.end(JSON.stringify(data));
            Response(res, data);
        })
    }catch(e){
        data = {
            status: 2,
            message: '服务器出错了',
            data: e,
        }
        // res.end(JSON.stringify(data));
        Response(res, data);
    }
});
router.post('/edit', function(req, res, next){
    res.send('编辑留言');
});
router.get('/remove', function(req, res, next){
    const commentId = req.query.id;
    const author = req.session.user._id;

    let data = {};
    try{
        CommentModel.getCommentById(commentId)
        .then(function(comment){
            if(!comment){
                data = {
                    status: 2,
                    message: '该留言不存在'
                }
                // res.end(JSON.stringify(data));
                Response(res, data);
            } else if(comment.author.toString() !== author.toString()) {
                data = {
                    status: 2,
                    message: '你没有删除留言的权限'
                }
                // res.end(JSON.stringify(data));
                Response(res, data);
            }
            CommentModel.delCommentById(commentId).then(function(){
                data = {
                    status: 1,
                    message: '删除留言成功'
                }
                // res.end(JSON.stringify(data));
                Response(res, data);
            }).catch(function(e){
                data = {
                    status: 2,
                    message: '数据出错了',
                    data: e,
                }
                // res.end(JSON.stringify(data));
                Response(res, data);
            })
        }).catch(function(e){
            data = {
                status: 2,
                message: '数据出错了',
                data: e,
            }
            // res.end(JSON.stringify(data));
            Response(res, data);
        })
    }catch(e){
        data = {
            status: 2,
            message: '服务器出错了！',
            data: e,
        }
        // res.end(JSON.stringify(data));
        Response(res, data);
    }
    // res.send('删除留言');
});

module.exports = router;