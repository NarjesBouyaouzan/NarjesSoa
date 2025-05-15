const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }



})

module.exports = mongoose.model('User', userSchema);
