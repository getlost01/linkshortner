const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shortUrlSchema = new Schema({
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
    default: false
  },
  count: {
    type: Number, 
    default: 0,
    required: true
  },
  timeCreation: {
    type: Date,
    default: Date.now,
    required: true
  },
  timeDeletion: {
    type: Date,
    required: true
  },
  password: {
    type: Boolean,
    default: false,
    required: true
  },
  passwordHash: {
    type: String,
    default: ""
  }
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

module.exports = ShortUrl;
