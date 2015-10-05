var mongoose = require('mongoose');
var Route;
var Marker  = require('src/schemas/marker');

Route = new mongoose.Schema({
    rid: String,
    markers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marker'
    }],
    date: {type: Date, default: Date.now}
});

mongoose.model("Route", Route);

module.exports = mongoose.model('Route');