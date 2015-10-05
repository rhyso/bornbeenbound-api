var mongoose = require('mongoose');

Marker = new mongoose.Schema({
    mid: String,
    title: String,
    lat: Number,
    lng: Number
});

mongoose.model("Marker", Marker);

module.exports = mongoose.model('Marker');