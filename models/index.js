var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/tunely");

var Album = require("./album.js");
module.exports.Album = Album;

