const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  name: { type: String },
  date: { type: Date },
  index: { type: Number },
  companies: { type: Array },
  element_ename: { type: Array },
  element_eweight: { type: Array },
  element_eprice: { type: Array },
  element_name: { type: Array },
  element_weight: { type: Array },
  element_amount: { type: Array },
  element_price: { type: Array },
  creator: { type: String, ref: 'User', required: true },
});

module.exports = mongoose.model('Post', postSchema);
