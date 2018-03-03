let express = require('express');
let body_parser = require('body-parser');
let cookie_parser = require('cookie-parser');
let session = require('express-session');
let flash = require('express-flash');
let configs = require('./configs.js');
let db = require('./db');
let app = express();


//Start mongodb
db.connect(configs.dbUrl, configs.dbName, function() {

  //Setting template engine
  app.set('view engine', 'ejs');
  app.set('views', './views');
  

  //Middleware
  app.use(express.static('public'));
  app.use(body_parser.urlencoded({extended: false}));
  app.use(session({secret: 'sese22', saveUninitialized: false, resave: false}));
  app.use(cookie_parser());
  app.use(flash());
  app.use(require('./controllers'));


  //Start app
  app.listen(configs.port, (err) => {
    if (err) {console.log(err);}
    console.log('Server listening on port ' + configs.port);
  });

});







