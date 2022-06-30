var express = require('express');
var router = express.Router();

var userModel = require('../models/users')


/* router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}); */

router.post('/sign-up', async function(req, res, next){

  var usernameAlreadyExist = await userModel.findOne({ username: req.body.username.toLowerCase() });
  var emailAlreadyExist = await userModel.findOne({ email: req.body.email.toLowerCase() });


  if(usernameAlreadyExist == null && emailAlreadyExist == null) {

    var newUser = new userModel ({
      email: req.body.email.toLowerCase(),
      username: req.body.username.toLowerCase(),
      password: req.body.password
    });
      
      var userSaved = await newUser.save();

      req.session._id = userSaved._id
      req.session.username = userSaved.username

      
      res.redirect('/tickets')

  } else {
    res.redirect('/?useralreadyExist=true')
  }

});

router.post('/sign-in', async function(req, res, next){

  var currentUser = await userModel.findOne({ email: req.body.email.toLowerCase() });


  if (currentUser != null && currentUser.password == req.body.password) {
    req.session._id = currentUser._id
    req.session.username = currentUser.username
    res.redirect('/tickets')
  } else if (currentUser != null && currentUser.password != req.body.password) {
    res.redirect('/?wrongpassword=true')
  } else if (currentUser == null) {
    res.redirect('/?userdontexist=true')
  }

});

 
router.get('/logout', function(req,res,next){
  req.session.username = null
  req.session._id = null

  res.redirect('/')
})





module.exports = router;
