const { query } = require('../scripts/utils.js');

// api接口路由
module.exports = (router) => {
  router.get('/api/test', async function (ctx, next) {
    let res = await query('select * from users');
    ctx.status = 200;
    ctx.body = res;
  });
}
