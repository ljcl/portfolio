require('dotenv').load()
module.exports = {
  autoprefixer: 'last 2 versions',
  port: process.env.PORT || 4000,
  paths: {
    src: './source/',
    static: './public/'
  }
}
