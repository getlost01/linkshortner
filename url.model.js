const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShortUrlSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  shortId: {
    type: String,
    required: true
  },
  custom: {
    type: Boolean,
    required: false
  },
  count: {
    type: Number, 
    default: 0,
    required: true
  },
  TimeCreation: {
    type: Date,
    required: true,
    default: new Date()
  },
  TimeDeletion: {
    type: Date,
    required: true
  },
  password:{
    type: Boolean,
    default: false,
    required: true
  },
  passwordValue: {
    type: String,
    default: "",
    required: false
  }
})

const ShortUrl = mongoose.model('shortUrl', ShortUrlSchema)

module.exports = ShortUrl
