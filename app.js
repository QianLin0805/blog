const Koa = require('koa');
const Router = require('koa-router');

const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const debug = require('debug'); ('koa2:server');
const path = require('path');
const validator = require('koa-middle-validator');

const routes = require('./routes');
const config = require('./config');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || config.SERVICE.PORT;

// error handler
onerror(app);

// middlewares
app.use(bodyparser())
  .use(validator({
    customValidators: {
      isArray: function (value) {
        return Array.isArray(value);
      },
      isAsyncTest: function (testparam) {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            if (testparam === '42') { return resolve(); }
            reject();
          }, 200);
        });
      }
    },
    customSanitizers: {
      toTestSanitize: function () {
        return "!!!!";
      }
    }
  }))
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: { settings: { views: path.join(__dirname, 'views') } },
  }))
  .use(router.routes())
  .use(router.allowedMethods());

// logger
app.use(async (ctx, next) => {
  // console.log(`${ctx.method} ${ctx.url} - $ms`)
});

routes(router);

app.on('error', function (err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
});

module.exports = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
});
