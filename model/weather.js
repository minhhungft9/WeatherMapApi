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
  lightLevel: {
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
// MONGO DB
module.exports.getWeatherData = function(callback) {
  Weather.find(callback);
}

module.exports.createWeatherData = function(weather, callback) {
  Weather.create(Object.assign({}, weather, { createdAt: new Date() }), callback);
}

// FIREBASE
module.exports.getData = function(callbackSucess, callbackError) {
  ref.once('value', callbackSucess, callbackError);
}

module.exports.createData = function(weather, callback) {
  const currentDateString = (new Date()).toString();
  const weatherWithCreatedAt = Object.assign({}, weather, { createdAt: currentDateString });
  ref.push(weatherWithCreatedAt, callback);
}
