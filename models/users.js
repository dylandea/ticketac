var mongoose = require('mongoose')


var userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String
});


module.exports = mongoose.model('users', userSchema);