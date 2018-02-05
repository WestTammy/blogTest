const PostModel = require('../models/posts');
const CommentModel = require('../models/comments');
const express = require('express');
const router = express.Router();
const Response = require('../utils/response');

//获取所有文章
router.get('/', function(req, res, next){
    const author = req.query.author;
    let data = {};
    try{
        PostModel.getPosts(author)
        .then(function(posts){
            //获取数据成功
            data = {
                status: 1,
                message: '获取数据成功',
                data: posts
            }
            Response(res, data);
            // res.end(JSON.stringify(data));
        }).catch(function(e){
            data = {
                status: 2,
                message: '数据出错了！',
                data: e,
            }
            Response(res, data);
            // res.end(JSON.stringify(data));
            next(e);
        });
    }catch(e){
        data = {
            status: 2,
            message: '服务器出错了！',
            data: e
        }
        Response(res, data);
        // res.end(JSON.stringify(data));
    }
    
});

//根据id获取单独的一篇文章
router.get('/postId', function(req, res, next){
    //获取文章id
    const postId = req.query.id;
    let data = {};
    try{
        Promise.all([
            PostModel.getPostById(postId), //获取文章信息
            CommentModel.getComments(postId),//获取该文章所有留言
            PostModel.incPv(postId)  //浏览量加1
        ]).then(function(result){
            const post = result[0];
            const comments = result[1];
            if(!post){
                //文章不存在
                data = {
                    status: 2,
                    message: '该文章不存在！'
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
            }
            //返回成功
            data = {
                status: 1,
                message: '获取数据成功',
                data: {
                        post: post,
                        comments: comments
                    }
            };
            Response(res, data);
            // res.end(JSON.stringify(data));
        }).catch(next);
    }catch(e){
        data = {
            status: 2,
            message: '服务器出错了',
            data: e
        }
        Response(res, data);
        // res.end(JSON.stringify(data));
    }
    
});
//更新文章页
router.get('/edit/:postId', function(req, res, next){
    //更新文章页
    const postId = req.params.postId;
    const author = req.session.user._id;
    PostModel.getRawPostById(postId).then(function(post){
        if(!post){
            //文章不存在
        }else if(author.toString()!==post.author._id.toString()) {
            //权限不足
        }
        //返回成功
    }).catch(next);
});
//更新一篇文章
router.post('/edit', function(req, res, next){
    //更新文章
    const postId = req.body.id;
    const author = req.session.user._id;
    // const author = '5a6fd06bafb5c61f3078a208';
    const title = req.body.title;
    const content = req.body.content;

    let data = {};

    try{
        PostModel.getRawPostById(postId).then(function(post){
            if(!post){
                //文章不存在
                data = {
                    status: 2,
                    message: '该文章已被删除'
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
            }
            if(post.author._id.toString() !==author.toString()){
                //没有权限
                data = {
                    status: 2,
                    message: '你没有修改文章的权限'
                };
                Response(res, data);
                // res.end(JSON.stringify(data));
            }
            PostModel.updatePostById(postId, {title: title, content: content})
            .then(function(){
                //编辑成功
                data = {
                    status: 1,
                    message: '文章编辑成功'
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
            }).catch(function(e){
                data = {
                    status: 2,
                    message: '数据出错了！',
                    data: e
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
                next(e);
            });
        })
    }catch(e){
        data = {
            status: 2,
            message: '服务器出错了'
        };
        Response(res, data);
        // res.end(JSON.stringify(data));
    }

    
});
//删除文章 
router.get('/remove', function(req, res, next){
    //删除文章
    const postId = req.query.id;
    // console.log('>>>>>>>>>>>'+postId)
    // const author = req.session.user._id;
    const author = '5a6fd06bafb5c61f3078a208';
    let data = {};

    try{
        PostModel.getRawPostById(postId)
        .then(function(post){
            if(!post){
                //文章不存在
                data = {
                    status: 2,
                    message: '文章已不存在'
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
            }
            if(post.author._id.toString() !== author.toString()){
                //没有权限
                data = {
                    status: 2,
                    message: '你没有删除的权限'
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
            }
            PostModel.delPostById(postId)
            .then(function(){
                //删除成功
                data = {
                    status: 1,
                    message: '文章删除成功'
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
            }).catch(function(e){
                data = {
                    status: 2,
                    message: '数据出错了',
                    data: e
                }
                Response(res, data);
                // res.end(JSON.stringify(data));
                next(e);
            })
        })
    }catch(e){
        data = {
            status: 2,
            message: '服务器数据出错了！'
        };
        Response(res, data);
        // res.end(JSON.stringify(data));
    }
})
//创建文章
router.post('/update', function(req, res, next){
    // const author = req.session.user._id;
    const title = req.body.title;
    const content = req.body.content;
    let data = {};
    try{
        //成功
        let post = {
            author: '5a6fd06bafb5c61f3078a208',
            // author: author,
            title: title,
            content: content
        }
        PostModel.create(post)
        .then(function(result){
            //此post是插入mongodb后的值，包含_id;
            post = result.ops[0];
            //发表成功,返回文章地址
            data = {
                status: 1,
                message: '发表文章成功！',
                data: post
            };
            Response(res, data);
            // res.end(JSON.stringify(data));
        }).catch(next);
    }catch(e){
        //失败
        data = {
            status: 2,
            message: '服务器出错了！',
            data: e
        };
        Response(res, data);
        // res.end(JSON.stringify(data));
    };

    
});

module.exports = router;