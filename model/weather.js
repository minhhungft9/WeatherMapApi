var mongoose = require('mongoose');
var GUID = require('mongoose-guid');
var firebase = require('firebase');

firebase.initializeApp({
  serviceAccount: './Weather Mapping-09c00ead2a4b.json',
  databaseURL: 'https://weather-mapping-71e0a.firebaseio.com/'
})

var ref = firebase.database().ref('weatherData');

var weatherSchema = mongoose.Schema({
  _id: {
    type: GUID.type,
    default: GUID.value
  },
  temperature: {
    type: Number
  },
  humidity: {
    type: Number
  },
  noiselevel: {
    type: Number
  },
  co2level: {
    type: Number
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  createdAt: {
    type: String
  }
});

var Weather = module.exports = mongoose.model('Weather', weatherSchema);

// Get weather data
module.exports.getWeatherData = function(callback) {
  Weather.find(callback);
}

module.exports.createWeatherData = function(weather, callback) {
  Weather.create(Object.assign({}, weather, { createdAt: new Date() }), callback);
}

module.exports.getData = function(callbackSucess, callbackError) {
  ref.once('value', callbackSucess, callbackError);
}

module.exports.createData = function(weather, callback) {
  ref.set(weather, callback);
}
