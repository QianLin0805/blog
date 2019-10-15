module.exports = {
  // 服务器配置
  SERVICE: {
    HOST: "",
    PORT: "3000"
  },
  // 数据库连接配置
  DATABASE: {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'qjl252363',
    DATABASE: 'blog',
    CONNECTION_LIMIT: 10
  },
  // 上传路径配置
  PATH: {
    UPLOAD_PATH: "public/upload"
  },
  // 限制条件配置
  LIMIT: {
    UPLOAD_IMG_SIZE: 200 * 1024 * 1024
  }
}
