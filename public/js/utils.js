let mysql = require('mysql');
let config = require('/config');

let pools = mysql.createPool({
  host: config.DATABASE.HOST,
  user: config.DATABASE.USER,
  password: config.DATABASE.PASSWORD,
  database: config.DATABASE.DATABASE
});

// 查询sql
let query = function (sql, res, fn) {
  connect.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    if (typeof fn == 'function') {
      fn(result);
      return;
    }

    if (!Array.isArray(result)) {   // 接口返回值为非数组数据
      res.json({
        count: result.affectedRows,
        msg: '成功',
      });
      return;
    }
    res.json(result);
  });
}