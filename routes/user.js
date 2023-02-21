const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const Cat = require('../models/Cat');


//define storage for the images
const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, cb) {
      cb(null, 'uploads');
    },
  
    //add back the extension
    filename: function (request, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

//upload parameters for multer
const upload = multer({storage: storage});

//USER
router.get('/user/homepage', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser)
        {
        console.log("data session dalam ni => ", req.session.email)
        Cat.find({}).exec(function(err,kucing){
            console.log(kucing);
            res.render('User/index.ejs', {kucing});   
        });
        }
        else {res.send('Sorry not authorized');}
    } 
    else {
        res.redirect('/login');
    }
});
router.get('/user/booksearched', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser)
        {
            var search=req.query.search;
            console.log(search);
            let regex = new RegExp(`^[${search}0-9._-]+$`, "ig");
            Book.find({title:{$regex: search} }, function(err,buku){
                console.log(buku);
                res.render('User/allbook.ejs', {buku});   
            });  
        }
        else {res.send('Sorry not authorized');}
        }
    else {
         res.redirect('/login');
        }
});
router.get('/user/catdetails/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser)
        {
            Cat.findOne({_id: req.params.id}, function(err,kucing){
                User.findOne({email: kucing.seller}, function(err,info)
                {
                 res.render('User/catdetails.ejs', {kucing,info});  
                });
                
            });
        } 
         else {res.send('Sorry not authorized');}
        }
        else {
            res.redirect('/login');
        }
});
router.get('/user/logout', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser)
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
router.get('/user/account', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser){
            email = req.session.email;
            User.findOne({email}, function(err,info){
            res.render('User/account.ejs', {info});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.get('/user/editaccount', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser){
            email = req.session.email;
            User.findOne({email}, function(err,info){
            res.render('User/editaccount.ejs', {info});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.post('/user/editaccount/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser){
            User.findByIdAndUpdate(req.params.id, { $set: req.body},function (err, info) {
                if (err) {
                  console.log(err);
                }                  
                  res.redirect("/user/account");
              });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});

router.get("/user/allcats", (req, res) => { res.render("User/allcats.ejs");});
router.get('/user/addcat', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser)
        {
            email = req.session.email;
            User.findOne({email}, function(err,info){ 
            if(info.contact !== null)
            {
                res.render("User/addcat.ejs");
            }
            else
            {
                res.redirect("/user/editaccount"); 
            }
         });
        }
        else {res.send('Sorry not authorized');}
    } 
    else {
        res.redirect('/login');
    }
});
//route that handles new post
router.post('/user/addcat', upload.single('image'), async (req, res) => {
    if(req.session.loggedin) {
        if(req.session.isUser){
            this.name = req.body.name;
            this.color = req.body.color;
            this.size = req.body.size;
            this.type = req.body.type;
            this.image = req.file.filename;
            this.state = req.body.state;
            this.city = req.body.city;
            
            const newCat = new Cat ({
                name: this.name,
                image: this.image,
                color : this.color,
                size : this.size,
                state : this.state,
                city:this.city,
                type:this.type,
                status : 'Pending',
                seller : req.session.email
            });
            newCat.save();
            console.log('Cat successfully registered =>', newCat);
            res.redirect('/user/catlist');
        }
        else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.get('/user/editaccount', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser){
            email = req.session.email;
            User.findOne({email}, function(err,info){
            res.render('User/editaccount.ejs', {info});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.post('/user/editcat/:id',upload.single('image'), function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser){
            Cat.findByIdAndUpdate(req.params.id, {$set: req.body, image:req.file.filename},function (err, kucing) {
                if (err) {
                  console.log(err);
                }                  
                  console.log('User successfully updated =>', kucing);
                  res.redirect('/user/catlist');
              });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});
router.get('/user/editcat/:id', function(req, res) {
    if(req.session.loggedin) {
    if(req.session.isUser){
        Cat.findOne({_id: req.params.id}).exec(function (err, kucing) 
        {
        if (err) {
            console.log("Error:", err);
        }
        else {
            res.render("User/editcat.ejs", {kucing});
        }
        });
    }
    else {res.send('Sorry not authorized');}
    }
    else {
        res.redirect('/login');
    }
});
router.get('/user/deletebook/:id', function(req, res) {
    if(req.session.loggedin) {
        if(req.session.isUser){
            Cat.deleteOne({_id: req.params.id}, function(err) {
      if(err) {
        console.log(err);
      }
      else {
        console.log("Product deleted!");
        res.redirect("/user/catlist");
      }
    });
    } else {res.send('Sorry not authorized');}
    }
    else {
        res.redirect('/login');
    }
  });


  router.get('/user/catlist', function(req, res) {

    if(req.session.loggedin) {
        if(req.session.isUser){
            email = req.session.email;
            Cat.find({seller:email}, function(err,kucing){
            console.log('Ini info', kucing);
            res.render('User/catlist.ejs', {kucing});    
            });
        }
    else {res.send('Sorry not authorized');}
    }
    else {
    res.redirect('/login');
    }
});


module.exports = router;