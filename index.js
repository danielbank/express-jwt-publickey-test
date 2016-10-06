var express = require('express');
var app = express();
var fs = require('fs');
var ejwt = require('express-jwt');
var jwt = require('jsonwebtoken');

// sign with private key
var cert = fs.readFileSync(__dirname + '/private.key');  // get private key
var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'});

console.log('token:', token);

// verify with public key
var publicKey = fs.readFileSync(__dirname + '/public.pub');

jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function (err, payload) {
  console.log(err, payload);
});

app.get('/',
  ejwt({
    secret: publicKey,
    getToken: function (req) {
      return token;
    }
  }),
  function(req, res) {
    res.sendStatus(200);
  });

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});