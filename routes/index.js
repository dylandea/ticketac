var express = require('express');
var router = express.Router();
var request = require('sync-request');


/* GET login page. */
router.get('/', function(req, res, next) {
  
  res.render('login', { title: 'Ticketac', useralreadyExist: req.query.useralreadyExist, wrongpassword: req.query.wrongpassword, userdontexist: req.query.userdontexist });
});

module.exports = router;

