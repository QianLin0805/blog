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
        // err = {
        //   address: "127.0.0.1",
        //   code: "ECONNREFUSED",
        //   errno: "ECONNREFUSED",
        //   fatal: true,
        //   port: 3306,
        //   syscall: "connect",
        //   message: "connect ECONNREFUSED 127.0.0.1:3306",
        // }
        return resolve(err)
      }
      // 执行查询语句
      connect.query(sql, (err, res) => {
        connect.release();
        if (err) {
          // err = {
          //   code: "ER_BAD_FIELD_ERROR",
          //   errno: 1054,
          //   index: 0,
          //   sql: "select * from users where usernam='test'",
          //   sqlMessage: "Unknown column 'usernam' in 'where clause'",
          //   sqlState: "42S22",
          //   message: "ER_BAD_FIELD_ERROR: Unknown column 'usernam' in 'where clause'",
          // }
          return resolve(err)
        }
        // select => array
        // insert => {
        //   affectedRows: 1,
        //   changedRows: 0,
        //   fieldCount: 0,
        //   insertId: 4,
        //   message: "",
        //   protocol41: true,
        //   serverStatus: 2,
        //   warningCount: 0,
        // }
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

// 接口请求成功，返回json数据
function setApiJson(ctx, res, json) {
  json = json ? json : {};
  ctx.status = 200;
  ctx.body = {
    code: json.code ? json.code : 200,
    msg: json.msg ? json.msg : '成功',
    data: res,
  };
}
// 统一处理接口请求结果
function setApiResult(ctx, res, json) {
  // 接口请求失败，返回服务器错误信息
  if (res.errno) {
    if (res.errno === 'ECONNREFUSED') {
      ctx.status = 408;
      res.msg = '服务器未连接';
      ctx.body = res;
      return;
    }
    ctx.status = 500;
    res.msg = '内部错误';
    ctx.body = res;
    return;
  }
  // 接口请求成功，返回结果
  setApiJson(ctx, res, json);
}

// 提取接口入参对象中的key和value
function formatParams(params) {
  let keys = [], values = [];
  for (key in params) {
    if (params[key]) {
      keys.push(key);
      values.push(`"${params[key]}"`);
    }
  }
  return { keys: keys, vals: values };
}

module.exports = {
  query,
  validate,
  setApiJson,
  setApiResult,
  formatParams,
};
