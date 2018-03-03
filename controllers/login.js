let express = require('express');
let users = require('../db').getCollection('users');
let bcrypt = require('bcrypt');
let router = express.Router();


router.use((req, res, next) => {
  console.log(req.method.toUpperCase() + ' Request to /login');
  next();
});


router.get('/', (req, res) => {
  if (req.session.login == 'true') {
    res.render('login', {login: 'true'});
  }
  else { res.render('login', {login: 'false',
                              email: ''}); 
  }
});


router.post('/', (req, res) => {
  users.findOne({email: req.body.email}, (err, result) => {
    if (err) { console.log(err); }
    if (result) {
      bcrypt.compare(req.body.password, result.password, (err, resu) => {
        if (err) { console.log(err); }
        if (resu == true) {
          console.log('Login success.');
          req.session.login = 'true';
          req.flash('login', 'Login success.');
          res.render('home', {login: 'true'});
        }
        else {
          req.flash('wrongPassword', 'Wrong password.');
          res.render('login', {login: 'false', email: req.body.email});
        }
      });
    }
    else {
      req.flash('wrongEmail', 'Email doesnt exist.');
      res.render('login', {login: 'false', email: req.body.email});
    }
  });
});


module.exports = router;
