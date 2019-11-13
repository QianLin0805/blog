const crypto = require("crypto-js");   // 加密组件
const Router = require('koa-router');
const { query, setApiJson, setApiResult, formatParams } = require('../../scripts/utils.js');

const userRoutes = require('./user.js');
const user = new Router();

userRoutes(user);

// api接口路由
module.exports = (router) => {
  // 装载子路由
  router.use('/user', user.routes(), user.allowedMethods());

  // 注册
  router.post('/register', async function (ctx, next) {
    let params = ctx.request.body;
    let users = await query(`select * from users where username='${params.username}'`);

    // 判断用户名是否已经被注册
    if (users.length > 0) {
      setApiJson(ctx, null, {
        code: 300,
        msg: '用户名已被注册'
      });
      return;
    }

    params.password = crypto.MD5(params.password).toString().toUpperCase();
    let obj = formatParams(params),
      sql = `insert into users (${obj.keys.join(',')}) values (${obj.vals.join(',')})`,
      res = await query(sql);
    setApiResult(ctx, res);
  });

  // 登录
  router.post('/login', async function (ctx, next) {
    let params = ctx.request.body;
    params.password = crypto.MD5(params.password).toString().toUpperCase();
    let sql = `select * from users where username='${params.username}' and password='${params.password}'`;
    let users = await query(sql);

    if (users.length <= 0) {
      setApiJson(ctx, null, {
        code: 300,
        msg: '用户名或密码不正确'
      });
      return;
    }

    let user = users[0];
    let token = `userid=${user.userid};username=${user.username};timestamp=${Date.parse(new Date())}`;
    // token = encrypt(token);
    // user.token = token;
    user.birthday = user.birthday.toLocaleDateString();
    setApiJson(ctx, user);

  });

}
