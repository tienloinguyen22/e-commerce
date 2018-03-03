let express = require('express');
let router = express.Router();


router.get('/', (req, res) => {
  req.session.login = 'false';
  // req.flash('logout', 'Log out success.')
  res.redirect('/');
});

module.exports = router;