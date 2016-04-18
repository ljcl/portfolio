var keystone = require('keystone')
var Types = keystone.Field.Types

var User = new keystone.List('User')

User.add({
  name: {
    type: Types.Text,
    required: true,
    initial: true,
    index: true
  },
  email: {
    type: Types.Email,
    required: true,
    initial: true,
    index: true
  },
  password: {
    type: Types.Password,
    required: true,
    initial: true,
    index: true
  }
}, 'Permissions', {
  isAdmin: {
    type: Boolean,
    label: 'Can access cp',
    index: true
  }
})

// Give user access to cp
User.schema.virtual('canAccessKeystone').get(function () {
  return this.isAdmin
})

User.register()
