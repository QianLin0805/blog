const Router = require('koa-router');
const loginRoutes = require('./login.js');
const registerRoutes = require('./register.js');
const userRoutes = require('./user.js');

const login = new Router();
const register = new Router();
const user = new Router();

loginRoutes(login);
registerRoutes(register);
userRoutes(user);

// api接口路由
module.exports = (router) => {

  // 装载子路由
  router.use('/login', login.routes(), login.allowedMethods());
  router.use('/register', register.routes(), register.allowedMethods());
  router.use('/user', user.routes(), user.allowedMethods());

}
