module.exports =  (router) => {

  // 前台页面路由
  router.get('/', async function (ctx, next) {
    // console.log(ctx)
    ctx.state = {
      title: '熊猫的博客'
    };

    await ctx.render('/web', {title: ctx.state});
  });

  // 后台管理页面路由
  router.get('/admin/', async function (ctx, next) {
    ctx.state = {
      title: '博客后台管理系统'
    };

    await ctx.render('/admin', {title: ctx.state});
  });

  // api接口路由
  router.get('/api/', async function (ctx, next) {
    // ctx.state = {
    //   title: 'koa2 title'
    // };

    // await ctx.render('index', {title: ctx.state});
  });

}
