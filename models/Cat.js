const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String
  },
  size :{
    type : String
  },
  type :{
    type : String
  },
  image :{
    type : String
  },
  state :{
    type : String
  },
  city :{
    type: String
  },
  status:{
    type: String,
    default: 'Pending'
  },
  seller:{
    type: String
  }
});

const Cat = mongoose.model('Cat', CatSchema);

module.exports = Cat;