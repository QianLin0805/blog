const { query, setApiJson } = require('../../scripts/utils.js');

// api接口路由
module.exports = (router) => {

  router.get(`/userid/:id`, async function (ctx, next) {
    let userid = ctx.params.id;
    let res = await query(`select * from users where userid='${userid}'`);
    setApiJson(ctx, res);
  });

  router.get(`/username/:name`, async function (ctx, next) {
    let username = ctx.params.name;
    let res = await query(`select * from users where username='${username}'`);
    setApiJson(ctx, res);
  });
  
}