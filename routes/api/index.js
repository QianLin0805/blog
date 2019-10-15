

module.exports =  (router) => {
  router.all('/api/', async function (ctx, next) {
    console.log(ctx)
  });

}
