var express =  require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

//our routes
var books = require('./routes/books');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/books',books);
//request comes to /books and it goes into the books(the required routes)

// Catchall route
app.get('/*', function (req, res) {
  var file = req.params[0] || '/views/index.html';
  res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log('Listening on port ', app.get('port'));
});
