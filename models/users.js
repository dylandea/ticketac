var mongoose = require('mongoose')


var userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    journeyHistory : [{ type: mongoose.Schema.Types.ObjectId, ref: 'journeys' }],
});


module.exports = mongoose.model('users', userSchema);