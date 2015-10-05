var mongoose = require('mongoose');
var User;

User = new mongoose.Schema({
    userId: String,
    accessToken: String
});

mongoose.model('User', User);

module.exports = mongoose.model('User');