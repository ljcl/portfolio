require('dotenv').load()
module.exports = {
  autoprefixer: 'last 2 versions',
  browser_sync: {
    port: process.env.BS_PORT || 4000,
    proxy: 'localhost:' + process.env.PORT || 3000
  },
  paths: {
    src: './source/',
    static: './public/'
  }
}
