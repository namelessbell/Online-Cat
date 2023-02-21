const express = require('express');
const Cat = require('../models/Cat');
const router = express.Router();
const User = require('../models/User');

//ADMIN
router.get('/admin/homepage', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser ===false)
        {
            User.count({isUser:true}, function(err,countuser){
            Cat.count({status:'Pending'}, function(err,countkucing){
            Cat.count({status:'Approved'}, function(err,countok){
                console.log(countuser);
                console.log(countkucing);
                console.log(countok);
                res.render('Admin/index.ejs', {countuser,countkucing,countok}); 
                     });
                 });
            });
              
        }
        else {res.send('Sorry not authorized');}
    }
    else 
    {
    res.redirect('/login');
    }
});

router.get('/admin/logout', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser ===false)
        {
        req.session.destroy();
        res.redirect('/login');
        }
        else {res.send('Sorry not authorized');}
        }
    else {
         res.redirect('/login');
        }
});
router.get('/admin/account', function(req, res) {
    email = req.session.email;
    if(req.session.loggedin) {
        if(req.session.isUser ===false)
        {
            User.findOne({email}, function(err,info){
            res.render('Admin/account.ejs', {info});    
            });
        }
        else {res.send('Sorry not authorized');}
        }
    else {
         res.redirect('/login');
        }
});
router.get('/admin/pendingcat', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser === false){
          Cat.find({status:'Pending'}, function(err,kucing){
            console.log('Ini info', kucing);
            res.render('Admin/pendingcat.ejs', {kucing});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.get('/admin/allcats', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser === false){
          Cat.find({status:'Approved'}, function(err,kucing){
            console.log('Ini info', kucing);
            res.render('Admin/allcats.ejs', {kucing});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.get('/admin/deletebook/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser === false){
          Cat.deleteOne({_id: req.params.id}, function(err) {
      if(err) {
        console.log(err);
      }
      else {
        res.redirect("/admin/allcats");
      }
    });
    } else {res.send('Sorry not authorized');}
    }
    else {
        res.redirect('/login');
    }
  });
router.get('/admin/verifybook/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser===false){
          Cat.findByIdAndUpdate(req.params.id, {$set: {status: 'Approved'}},function (err, kucing) {
      if(err) {
        console.log(err);
      }
      else {
        console.log("Product Uploaded!");
        res.redirect("/admin/pendingcat");
      }
    });
    } else {res.send('Sorry not authorized');}
    }
    else {
        res.redirect('/login');
    }
  });

router.get('/admin/userlist', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser ===false)
        {
            User.find({isUser:true}, function(err,info){
            res.render('Admin/userlist.ejs', {info});    
            });
        }
        else {res.send('Sorry not authorized');}
        }
    else {
         res.redirect('/login');
        }
});
router.get('/admin/deleteuser/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser === false){
    User.deleteOne({_id: req.params.id}, function(err) {
      if(err) {
        console.log(err);
      }
      else {
        res.redirect("/admin/userlist");
      }
    });
    } else {res.send('Sorry not authorized');}
    }
    else {
        res.redirect('/login');
    }
  });

module.exports = router;