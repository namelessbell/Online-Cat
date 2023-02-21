const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    default: true
  },
  contact :{
    type : String,
    default : null
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
