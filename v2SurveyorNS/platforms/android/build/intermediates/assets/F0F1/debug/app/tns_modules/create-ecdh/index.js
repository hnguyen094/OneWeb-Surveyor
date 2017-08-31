var createECDH = require('crypto-browserify').createECDH;

module.exports = createECDH || require('./browser');