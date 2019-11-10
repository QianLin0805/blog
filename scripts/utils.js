const mysql = require('mysql');
const config = require('../config');

const db = config.DATABASE;
const pools = mysql.createPool({
  host: db.HOST,
  user: db.USER,
  password: db.PASSWORD,
  database: db.DATABASE
});

// 查询数据库
function query(sql) {
  return new Promise((resolve, reject) => {
    // 连接数据库
    pools.getConnection((err, connect) => {
      if (err) {
        console.log('服务器未连接');
        return reject(err);
      }
      // 执行查询语句
      connect.query(sql, (err, res) => {
        connect.release();
        if (err) {
          return resolve(err)
        }
        return resolve(res);
      });
    });
  });
}

// 接口请求验证
function validate(ctx) {
  ctx.checkBody('postparam', 'Invalid postparam').notEmpty().isInt();
  // ctx.checkParams('urlparam', 'Invalid urlparam').isAlpha();
  ctx.checkQuery('getparam', 'Invalid getparam').isInt();


  ctx.sanitizeBody('postparam').toBoolean();
  // ctx.sanitizeParams('urlparam').toBoolean();
  ctx.sanitizeQuery('getparam').toBoolean();

  ctx.sanitize('postparam').toBoolean();

  return ctx.getValidationResult().then(function (result) {
    ctx.body = {
      //
    }
  });
}

// 统一处理接口请求的数据返回
function setApiJson(ctx, res, callback, msg) {
  // 处理服务器内部错误
  if (res.errno) {
    res.msg = '内部错误';
    ctx.status = 500;
    ctx.body = res;
    return;
  }
  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: '成功',
    data: res,
  };
}

module.exports = {
  query,
  validate,
  setApiJson,
};
