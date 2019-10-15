module.exports =  (router) => {

  // 前台页面路由
  router.get('/', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title'
    };

    await ctx.render('index', {title: ctx.state});
  });

  // 后台管理页面路由
  router.get('/admin/', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title'
    };

    await ctx.render('index', {title: ctx.state});
  });

  // api接口路由
  router.get('/api/', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title'
    };

    await ctx.render('index', {title: ctx.state});
  });

}
