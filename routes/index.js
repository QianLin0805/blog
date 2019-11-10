const Router = require('koa-router');
const apiRoutes = require('./api/api.js');
const api = new Router();

apiRoutes(api);

module.exports = (router) => {
  // 博客页面路由
  router.get('/', async function (ctx, next) {
    // console.log(ctx)
    ctx.state = {
      title: '熊猫的博客'
    };

    await ctx.render('/web', { title: ctx.state });
  });

  // 后台管理页面路由
  router.get('/admin/', async function (ctx, next) {
    ctx.state = {
      title: '博客后台管理系统'
    };

    await ctx.render('/admin', { title: ctx.state });
  });

  // 装载子路由api
  router.use('/api', api.routes(), api.allowedMethods());
}
