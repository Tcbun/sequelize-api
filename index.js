const _ = require('lodash');//其实我也不知道lodash具体干嘛用的，好像是关于兼容性的，因为一直在热度榜第一，而且下面options有用这个_.omit于是我就引用了。
const Koa = require('koa');
const app = new Koa();
//const onerror = require('koa-onerror'); //这个会返回错误的一些感觉没什么用的信息，抛弃，选择koa-json-error
//onerror(app);
const error = require('koa-json-error'); //这是koa一个非常棒的解决方案，可以返回错误信息，名字，状态码，追踪栈，你可以直接返回给前端
const koabody = require('koa-body');
let options = {
    // Avoid showing the stacktrace in 'production' env
    postFormat: (e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
};

const UserRouter = require('./routes/user');

app.use(error(options))
app.use(koabody());
app.use(UserRouter.routes(),UserRouter.allowedMethods());//每个路由都要一个，你可以弄个注册机

app.listen(3000,()=>{
    console.log('服务器启动在3000端口');
})

