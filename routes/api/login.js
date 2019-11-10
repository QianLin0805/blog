const { query, setApiJson } = require('../../scripts/utils.js');

module.exports = (router) => {

  // 登录
  router.post('/login', async function (ctx, next) {
    let res = await query('select * from users');
    ctx.status = 200;
    ctx.body = res;
  });

}