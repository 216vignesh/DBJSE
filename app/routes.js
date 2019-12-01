// Routes: 
// Home Page: '/'
// Login Page: '/login'
// Signup Page: '/signup'
// Profile: after logged in
// var Author = require('/models/User');



var Author = require('../app/models/user.js');
var Reviewer = require('../app/models/reviewer.js');

var Paper = require('../app/models/paper.js');


module.exports= function (app, passport) {

    
    //home
    app.get('/', function (req, res) {
        res.render('index.ejs', {
            req: req
        });

    });

    app.get('/about', function(req, res) {
        res.render('about.ejs',{
            req: req
        });
      });

    app.get('/contact', function(req, res) {
        res.render('contact.ejs', {
            req: req
        });
    });

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            req: req
        });
    });

    ///////////////ROUTES FOR AUTHOR////////////////////////


    //login
    app.get('/author/alogin', function (req, res) {
        res.render('author/alogin.ejs', { message: req.flash('loginMessage'), req: req });
    });

    //signup 
    app.get('/author/asignup', function (req, res) {
        res.render('author/asignup.ejs', { message: req.flash('signupMessage'), req: req });
    });

    //profile
    app.get('/author/aprofile', isLoggedInAsAuthor, function (req, res) {
        res.render('author/aprofile.ejs', {
            author: req.user.local,// get the user out of session and pass to template
            authorid: req.user,
            req: req
        });
    });

    //logout
    app.get('/logout', function (req, res) {
        req.session.destroy(function(err){
            res.redirect('/');
        });
    });

    //for processing the signup form
    app.post('/author/asignup', passport.authenticate('local-author-signup', {
        successRedirect: '/author/aprofile',
        failureRedirect: '/author/asignup',
        failureFlash: true
    }));

    //for processing the login form
    app.post('/author/alogin', passport.authenticate('local-author-login', {
        successRedirect: '/author/aprofile',
        failureRedirect: '/author/alogin',
        failureFlash: true
    }));

    

    //////ROUTES FOR REVIEWER//////////////////////

    //login
    app.get('/reviewer/rlogin', function (req, res) {
        res.render('reviewer/rlogin.ejs', { message: req.flash('loginMessage'), req: req });
    });

    //signup 
    app.get('/reviewer/rsignup', function (req, res) {
        res.render('reviewer/rsignup.ejs', { message: req.flash('signupMessage'), req: req });
    });

    //profile
    app.get('/reviewer/rprofile', isLoggedInAsReviewer, function (req, res) {
        res.render('reviewer/rprofile.ejs', {
            reviewer: req.user.local, // get the user out of session and pass to template
            req: req
        });
        // console.log("THIS IS REQ.REVIEWER::"+typeof(req.user.local));
    });

    app.get('/reviewer/rprofile/papers',isLoggedInAsReviewer ,function (req, res) {
        Paper.find(function (err, paprs) {
            if (err) {
                console.log(err);
            } else {
                res.render('reviewer/assignedpapers.ejs', {
                    paprs: paprs,
                    rev: req.user,
                    req: req
                });
                // console.log(req.user._id);
            }
        });
    });

    //for processing the signup form
    app.post('/reviewer/rsignup', passport.authenticate('local-reviewer-signup', {
        successRedirect: '/reviewer/rprofile',
        failureRedirect: '/reviewer/rsignup',
        failureFlash: true
    }));

    //for processing the login form
    app.post('/reviewer/rlogin', passport.authenticate('local-reviewer-login', {
        successRedirect: '/reviewer/rprofile',
        failureRedirect: '/reviewer/rlogin',
        failureFlash: true
    }));

    //////ROUTES FOR ADMIN//////////////////////

    //login
    app.get('/admin/adminlogin', function (req, res) {
        res.render('admin/adminlogin.ejs', { message: req.flash('loginMessage') });
    });

    //for processing the login form
    // app.post('/admin/adminlogin', passport.authenticate('local-admin-login', {
    //     successRedirect: '/admin/adminprofile',
    //     failureRedirect: '/admin/adminlogin',
    //     failureFlash: true
    // }));

    //profile
    app.get('/admin/adminprofile', 
    // isLoggedInAsAdmin,
     function (req, res) {
        res.render('admin/adminprofile.ejs', {
            // admin: req.user.local // get the user out of session and pass to template
        });
    });

    //view author table
    app.get('/admin/viewauthor',
        // isLoggedInAsAdmin,
        function (req, res) {
                Author.find(function (err, author) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('admin/viewauthor', {authors: author});
                    }
                });
            });

    //view reviewer table
    app.get('/admin/viewreviewer',
        // isLoggedInAsAdmin,
        function (req, res) {
            Reviewer.find(function (err, reviewer) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('admin/viewreviewer', {
                        rev: reviewer
                    });
                }
            });
        });



    //view paper table
    app.get('/admin/viewpaper',
        // isLoggedInAsAdmin,
        function (req, res) {
            Paper.find(function (err, paper) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('admin/viewpaper', {
                        paprs: paper
                    });
                }
            });
        });


    // hard delete author

    app.get('/admin/deleteauthor/:id', function(req, res){
        uid = req.params.id.toString();
        Author.remove({"_id":uid}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Success");
                res.redirect('/admin/viewauthor');
            }
        });
    });

    // hard delete reviewer

    app.get('/admin/deletereviewer/:id', function (req, res) {
        uid = req.params.id.toString();
        Reviewer.remove({
            "_id": uid
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Success");
                res.redirect('/admin/viewreviewer');
            }
        });
    });


    //hard delete paper

    app.get('/admin/deletepaper/:id', function (req, res) {
        uid = req.params.id.toString();
        Paper.remove({
            "_id": uid
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Success");
                res.redirect('/admin/viewpaper');
            }
        });
    });

    // block author

    app.get('/admin/blockauthor/:id', function (req, res) {
        uid = req.params.id.toString();
        Author.updateOne({
            "_id": uid
        }, {$set :{"local.blockedStatus": "1"}}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Blocked BITCHESSSSSS/n/n");
                res.redirect('/admin/viewauthor');
            }
        });
    });

    //unblock author

    app.get('/admin/unblockauthor/:id', function (req, res) {
        uid = req.params.id.toString();
        Author.updateOne({
            "_id": uid
        }, {$set :{"local.blockedStatus": "0"}}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("unBlocked BITCHESSSSSS/n/n");
                res.redirect('/admin/viewauthor');
            }
        });
    });

    // block reviewer

    app.get('/admin/blockreviewer/:id', function (req, res) {
        uid = req.params.id.toString();
        Reviewer.updateOne({
            "_id": uid
        }, {
            $set: {
                "local.blockedStatus": "1"
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Blocked BITCHESSSSSS/n/n");
                res.redirect('/admin/viewreviewer');
            }
        });
    });

    //unblock reviewer

    app.get('/admin/unblockreviewer/:id', function (req, res) {
        uid = req.params.id.toString();
        Reviewer.updateOne({
            "_id": uid
        }, {
            $set: {
                "local.blockedStatus": "0"
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("unBlocked BITCHESSSSSS/n/n");
                res.redirect('/admin/viewreviewer');
            }
        });
    });


app.get('/reviewer/viewpaper',
        // isLoggedInAsAdmin,
        function (req, res) {
                Paper.find(function (err, paper) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('reviewer/viewpaper', {papers : paper});
                        console.log(paper);
                    }
                });
            });


};

//middleware to make sure user is logged in

function isLoggedInAsAuthor(req, res, next) {
    // if user is authenticated in the session, carry on 
    // if (req.isAuthenticated())
    //     return next();

    console.log("In isLoggedInAsAuthor ", req.user, req.user.local.role);

    if (req.user.local.role == "Author")
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsReviewer(req, res, next) {
    // if user is authenticated in the session, carry on 
    // if (req.isAuthenticated())
    //     return next();

    if (req.user.local.role == "Reviewer")
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isLoggedInAsAdmin(req, res, next) {
    // if user is authenticated in the session, carry on 
    // if (req.isAuthenticated())
    //     return next();

    if (req.user.local.role == "Admin")
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}