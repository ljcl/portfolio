require('dotenv').load()

var keystone = require('keystone')
var request = require('request')
var port = process.env.PORT || 3000

keystone.init({
  'name': 'Luke Clark',
  'brand': 'Luke',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'jade',
  'auto update': true,
  'session': true,
  'session store': 'mongo',
  'auth': true,
  'user model': 'User',
  'admin path': 'cp',
  'cookie secret': process.env.SECRET
})

keystone.import('models')

keystone.set('locals', {
  _: require('underscore'),
  moment: require('moment-timezone'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable
})

keystone.set('routes', require('./routes'))

keystone.set('nav', {
  'users': 'users'
})

keystone.start()
