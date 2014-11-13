var express = require('express');
var router = express.Router();
var Account = require('../models/account.js');
var passport = require('passport');

var auth = passport.authenticate('local', {});

var godmode = false;
if(process.argv[2] === 'godmode'){
  godmode = true;
}

router.get('/', function(req, res){
  res.render('admin/tellusadmin', {
    title: '管理區',
    godmode: godmode
  });
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/tellusadmin/index',
  failureRedirect: '/tellusadmin'  
}));

router.get('/index', function(req, res){
  if(req.user){
    console.log('user promission: ' + req.user.promission);
    res.end('welcome to the admin panel ' + req.user.username + ', you promission is ' + req.user.promission);
  }
  else{
    res.end('sorry, you don\'t have the promission');
  }
})


router.get('/godmode', function(req, res){
  if(!godmode){
    res.redirect(401, '/');
    return;
  }
  res.render('admin/godmode');
});

router.post('/godmode', function(req, res){
  if(!godmode){
    res.redirect('/');
    return;
  }
  Account.register(new Account({ 
    username : req.body.username,
    promission : 1, 
    active : true
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render('admin/godmode', { 
        account : account 
      });
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/tellusadmin/index');
    });
  });    
})

module.exports = router;
