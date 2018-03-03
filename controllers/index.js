let express = require('express');
let mongodb = require('mongodb');
let products = require('../db').getCollection('products');
let router = express.Router();


router.get('/', (req, res) => {
  console.log(req.method.toUpperCase() + ' Request to /');
  products.find({addDate: {$gt: new Date(2018-01-15)}}).toArray((err, arr) => {
    if (err) {console.log(err);}
    if (arr) {
      if (req.session.login == 'true') {
        res.render('home', {login: 'true', data: arr});
      }
      else {
        res.render('home', {login: 'false', data: arr}); 
      }
    }
  });
});


router.get('/about', (req, res) => {
  console.log(req.method.toUpperCase() + ' Request to /about');
  if (req.session.login == 'true') {
    res.render('about', {login: 'true'});
  }
  else { res.render('about', {login: 'false'}); }
})


router.get('/categories/:category', (req, res) => {
  products.find({categoryName: req.params.category}).toArray((err, arr) => {
    if (err) {console.log(err);}
    if (arr) {
      if (req.session.login == 'true') {
        res.render('category', {login: 'true', data: arr});
      }
      else { res.render('category', {login: 'false', data: arr}); }
    }
  });
});


router.get('/product/:id', (req, res) => {
  console.log(req.method.toUpperCase() + ' Request to /product');
  products.findOne({_id: mongodb.ObjectID(req.params.id)}, (err, result) => {
    if (err) {console.log(err);}
    if (result) {
      if (req.session.login == 'true') {
        res.render('product', {login: 'true', product: result});
      }
      else {
        res.render('product', {login: 'false', product: result}); 
      }
    }
  });
});


router.use('/logout', require('./logout'));
router.use('/login', require('./login'));
router.use('/register', require('./register'));


module.exports = router;