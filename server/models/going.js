var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userService = require("../services/going-service");

var goingSchema = new Schema({
   rest_id: String,
   user_id: String,
   user_firstName: String,
   user_lastName: String,
   created: { type: Date, 'default': Date.now }
});

var Going = mongoose.model('Going', goingSchema);

module.exports = Going;
