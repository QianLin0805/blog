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
        return reject(err);
      }
      // 执行查询语句
      connect.query(sql, (err, res) => {
        connect.release();
        if (err) {
          return reject(err)
        }
        return resolve(res);
      });
    });
  });
}

module.exports = {
  query,
};

// 查询sql
// let query = function (sql, res, fn) {
//   connect.query(sql, (err, result) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     if (typeof fn == 'function') {
//       fn(result);
//       return;
//     }

//     if (!Array.isArray(result)) {   // 接口返回值为非数组数据
//       res.json({
//         count: result.affectedRows,
//         msg: '成功',
//       });
//       return;
//     }
//     res.json(result);
//   });
// }