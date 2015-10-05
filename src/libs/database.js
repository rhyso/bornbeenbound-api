var Promise  = require('promise');
var Utils   = require('src/libs/utils');
var config   = require('src/libs/config');
var mongoose = require('mongoose');
var shortid  = require('shortid');

// ---------------------------------
// Schema
// ---------------------------------

var Route  = require('src/schemas/route');
var Marker = require('src/schemas/marker');
var User   = require('src/schemas/user');

var database;

function DatabaseConnection (opts) {

    var options = {
        mongoUrl: config.get('mongoMarkers')
    };

    this.options = Utils.extend(options, (opts || {}));
    mongoose.connect(this.options.mongoUrl);

//    this.newRoute();
//    this.newUser();

};

DatabaseConnection.prototype.newUser = function () {

    var user = new User({
        userId: "10101306206124862",
        accessToken: "CAAMARG2JUPkBAFfKEq9xDLinAjFBw8HEplMzVLdjeQu7UAj9QhC6vqfsZBE4VjNICBMBDiIfK1BhYMbyNDl4Bay4DNNvHmDIhRryeXIZBL8OAtuRXECZCO4sHuWuAfZCa1kijZCNkZCzIX9ddu1bi6Czpo2xe8L1TwKZCAHybN3cSOmoGu6V7nZBsH9ej632aByNmhmBlkRJnwezGIDiemRO"
    });

    user.save(function (err) {
        if (err) {
            console.log('error', err);
        }
    });

}

DatabaseConnection.prototype.newRoute = function () {

    var route;
    var marker;

    marker = new Marker({
        mid: shortid.generate(),
        title: 'test',
        lat: -25.363,
        lng: 131.044
    });

    marker.save(function (err) {

        if (err) {
            console.log('error', err);
        }

        route = new Route({
            rid: shortid.generate(),
            markers: [marker._id]
        });

        route.save(function (err) {
            if (err) {
                console.log('error', err);
            }
        });

    });

};

DatabaseConnection.prototype.getRoutes = function (resolve, reject) {

    Route.find({})
        .populate('markers')
        .exec(function(err, routes){

            if (typeof resolve !== 'undefined') {
                resolve(routes);
            }

        });

};

DatabaseConnection.prototype.getRoute = function (options, resolve, reject) {

    Route.findOne({rid: options.rid}, {_id: 0}, function (err, data) {

        if (err) {
            reject({
                'err': err
            });
        }

        if (typeof resolve !== 'undefined') {
            resolve(data);
        }

    });

};

DatabaseConnection.prototype.requestData = function (options) {

    if (options !== undefined && options.rid !== undefined) {

        return new Promise(function (resolve, reject) {
            this.getDocument(options, resolve, reject);
        }.bind(this));

    } else {

        return new Promise(function (resolve, reject) {
            this.getRoutes(resolve, reject);
        }.bind(this));

    }

};

DatabaseConnection.prototype.authenticateUser = function (user) {

    return new Promise(function (resolve, reject) {

        User.findOne({
            userId: user.userId,
            accessToken: user.accessToken
        }, function (err, data) {

            if (err) {
                reject({
                    'err': err
                });
            }

            if (data === null) {
                reject(); // user not found...
            } else {
                resolve(data); // otherwise success...
            }

        });

    }.bind(this));

};

database = new DatabaseConnection();

// ---------------------------------
// Exports
// ---------------------------------

module.exports = {

    requestData: function (options) {
        return database.requestData(options);
    },

    authenticateUser: function (user) {
        return database.authenticateUser(user);
    }

};
