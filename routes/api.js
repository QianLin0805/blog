const utils = require('../scripts/utils.js');

// api接口路由
module.exports = (router) => {
  router.get('/api/test', async function (ctx, next) {

    let res = utils.query('select * from users')
    res.then(data => {
      ctx.status = 200;
      ctx.body = data;
    })

    // await ctx.render('index', {title: ctx.state});
  });
}
