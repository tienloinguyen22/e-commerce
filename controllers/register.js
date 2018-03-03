let express = require('express');
let users = require('../db').getCollection('users');
let bcrypt = require('bcrypt');
let saltRound = require('../configs').saltRound;
let router = express.Router();


router.use((req, res, next) => {
  console.log(req.method.toUpperCase() + ' Request to /register');
  next();
});


router.get('/', (req, res) => {
  if (req.session.login == 'true') {
    res.render('register', {login: 'true', email: '', f_name: '', l_name: ''});
  }
  else { res.render('register', {login: 'false', email: '', f_name: '', l_name: ''}); }
});


router.post('/', (req, res) => {
  let emailEmpty = !req.body.email;
  let passwordEmpty = !req.body.password;
  let checkboxEmpty = !req.body.checkbox;
  let emailExist;

  users.findOne({email: req.body.email}, (err, result) => {
    if (err) {console.log(err);}
    if (result) {
      emailExist = true;
    }
    else {
      emailExist = false;
    }
    if (emailEmpty) {req.flash('emailEmpty', 'Email is empty.');}
    if (emailExist) {req.flash('emailExist', 'This email has been used.');}
    if (passwordEmpty) {req.flash('passwordEmpty', 'Password is empty.');}
    if (checkboxEmpty) {req.flash('checkboxEmpty', 'You need to agree to sell your soul.');}
    if (emailEmpty || emailExist || passwordEmpty || checkboxEmpty) {
      if (req.session.login == 'true') {
        res.render('register', {login: 'true', email: req.body.email, f_name: req.body.f_name, l_name: req.body.l_name});
      }
      else { res.render('register', {login: 'false', email: req.body.email, f_name: req.body.f_name, l_name: req.body.l_name}); }
    }
    else {
      let newUser = {};
      newUser.email = req.body.email;
      newUser.f_name = req.body.f_name.toLowerCase();
      newUser.l_name = req.body.l_name.toLowerCase();
      bcrypt.hash(req.body.password, saltRound, (err, hash) => {
        if (err) {console.log(err);}
        if (hash) {newUser.password = hash;}
        users.insertOne(newUser, (err, resul) => {
          if (err) {console.log(err);}
          if (resul) {
            console.log('Register success.');
            req.flash('registerSuccess', 'Register success.');
            if (req.session.login == 'true') {
              res.render('login', {login: 'true', email: resul.ops[0].email});
            }
            else { res.render('login', {login: 'false', email: resul.ops[0].email}); }
          }
        });      
      });
    }   
  }); 
});


router.get('/check/:email', (req, res) => {
  users.findOne({email: req.params.email}, (err, result) => {
    if (err) { console.log(err); }

    if (result) {
      res.end('email exist');
    }
    else { res.end('email availble'); }
  });
});


module.exports = router;