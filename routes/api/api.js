const crypto = require("crypto-js");   // 加密组件
const Router = require('koa-router');
const { query, setApiJson, setApiResult } = require('../../scripts/utils.js');

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

    if (users.length > 0) {
      setApiJson(ctx, null, {
        code: 300,
        msg: '用户名已被注册'
      });
      return;
    }

    // let res = await query()
  });

}
