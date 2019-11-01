class User {
    async User(ctx){
        ctx.body = '访问首页成功！'
    }
}
module.exports = new User();