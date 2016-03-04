var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/', function (req, res) {
  res.render('index', {imageDate: imageDate});
});

app.get('/image', function (req, res) {
  res.sendfile(__dirname + '/images/out.jpg');
});

module.exports = router;
