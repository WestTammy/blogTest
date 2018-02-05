module.exports = {
    checkLogin: function checkLogin(req, res, next){
        if(!req.session.user){//未登录
            return;
        }
        next();
    },
    checkNotLogin: function checkNotLogin(req, res, next){
        if(req.session.user){//已登录
            return;
        }
    }
}