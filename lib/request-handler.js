var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec(function(err, links) {
    if (err) {
      console.log('error fetching links');
    }
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  } 
  
  Link.findOne({'url': uri}).exec(function(err, link) {
    if (err) {
      console.log('Link has an error', err);
      return res.sendStatus(404);
    } else {
      if (!link) {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('getUrlTitle Error', err);
            return res.sendStatus(404);
          } else {
            var newLink = new Link ({
              url: uri,
              title: title,
              baseUrl: req.headers.origin,
              visits: 0
            });
            newLink.save(function(err) {
              if (err) {
                console.log('err saving link', err);
                return res.sendStatus(500);
              }
              res.status(200).send(newLink);
            });
          }  
        });
      } else {
        res.status(200).send(link);
      }
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username': username}).exec(function(err, user) { 
    if (err) {
      console.log('the error', err); 
    } else { 
      if (!user) {
        res.redirect('/login');
      } else {
        User.comparePassword(password, user.password, function(match) { // check on
          if (match) {
            util.createSession(req, res, user); // check on 
          } else {
            res.redirect('/login');
          }
        });
      }
    }
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username': username}).exec(function(err, data) { 
    if (err) {
      console.log('the error', err); 
    } else {
      if (!data) {
        // var hashPassword = User.hashPassword(password);
        var newUser = new User({
          username: username,
          password: password
        });
        
        newUser.save(function(err) {
          if (err) {
            console.log('error on save');
          }
          
          res.status(302);
          util.createSession(req, res, newUser);
      
        });
      } else {
        console.log('Account already exists');
        res.status(302);
        res.redirect('/signup');
    
      }
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ 'code': req.params[0]}).exec(function(err, link) {
    if (err) {
      console.log('that err', err);
    }
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err, link) {
        if (err) {
          console.log('save ERRORROROROROOR', err);
        }
        res.redirect(link.url);
        return;
      });
    }
  });
};