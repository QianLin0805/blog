const { query, setApiJson } = require('../../scripts/utils.js');

module.exports = (router) => {

  // 注册
  router.post('/register', async function (ctx, next) {
    let params = ctx.params;
    let res = await query(`select * from users where username='${params.username}'`);

  })

}