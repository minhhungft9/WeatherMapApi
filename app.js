var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var mongoose = require('mongoose');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');

//Models
Weather = require('./model/weather');

app.get('/', function(req, res) {
  res.send('Please use /api/...');
});

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