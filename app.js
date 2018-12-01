var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var mongoose = require('mongoose');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');

//Connect to Mongoose
// mongoose.connect('mongodb://localhost/weathermapping', { useMongoClient: true, promiseLibrary: global.Promise });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('Connected to mongodb');
// });

//Models
Weather = require('./model/weather');

app.get('/', function(req, res) {
  res.send('Please use /api/...');
});

// Get weather data
// app.get('/api/weather', function(req, res) {
//   Weather.getWeatherData(function(err, weather) {
//     const filteredWeather = weather.filter(weather => {
//       const createdAt = new Date(weather.createdAt);
//       console.log(new Date().setHours(0,0,0,0));
//       console.log(new Date(new Date() - 1) > new Date());
//       return createdAt.setHours(0,0,0,0) >= (new Date(new Date() - 1)).setHours(0,0,0,0);
//     });

//     console.log(filteredWeather);

//     if (err)
//       throw err;
//     if (_.isEmpty(filteredWeather)) {
//       res.set('Access-Control-Allow-Origin', '*');
//       res.json({ errorCode: 'data-not-found' });
//     }
//     else {
//       res.set('Access-Control-Allow-Origin', '*');
//       res.json(filteredWeather);
//     }
//   });
// });

// app.post('/api/add', function(req, res) {
//   var weather = req.body;
//   Weather.createWeatherData(weather, function(err, weather) {
//     if (err)
//       throw err;  
//     res.json(weather);
//   });
// });

app.get('/v2/weather', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');  
  Weather.getData(function(snap) {
    const weather = convertObjectToArray(snap.val());
    const filteredWeather = weather.filter(weather => {
      const createdAt = new Date(weather.createdAt);
      console.log(weather);
      return createdAt.setHours(0,0,0,0) >= (new Date(new Date() - 1)).setHours(0,0,0,0);
    });
    
    res.json(filteredWeather ? filteredWeather : []);
  }, function(error) {
    console.log(error);
  });
});

app.post('/v2/weather', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');  
  Weather.createData(req.body, function(error) {
    if (!error) {
      res.json(req.body);
    }
  });
});

//Watcher controller
app.listen(app.get('port'), function() {
  console.log('Listening on port: ', app.get('port'));
});

function convertObjectToArray(object) {
  let array = [];
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      object[key]['id'] = key
      array.push(object[key]);
    }
  }
  return array;
}