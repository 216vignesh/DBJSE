var LocalStrategy= require('passport-local').Strategy;
var PhoneNumber = require('awesome-phonenumber');
var User = require('../app/models/user.js');
var Reviewer = require('../app/models/reviewer.js');
var Admin = require('../app/models/admin.js');

module.exports= function(passport){

    //Serialize user for perssistent logins

    passport.serializeUser(function(user, done){
        console.log("In serializeUser ", user);
        // console.log(user.local.name, user.gender);
        // console.log(user.status);
        done(null, {
            id: user.id,
            // checkAuthor: user.local.status == undefined
            checkAuthor: user.local.role
        });
    });

    //Deserlize the user

    passport.deserializeUser(function(user, done){
        // if (user.checkAuthor == true)
        // {
        //     console.log("This is the user checkuthor", user.checkAuthor);
        //     User.findById(user.id, function(err, user){
        //         done(err, user);
        //     });
        // }
        
        // else
        // {
        //     console.log("this is the reviewer checkauthor",user.checkAuthor);
        //     Reviewer.findById(user.id, function(err, user){
        //         done(err, user);
        //     });
        // }

        if (user.checkAuthor == "Author")
        {
            console.log("This is the user checkuthor", user.checkAuthor);
            User.findById(user.id, function(err, user){
                done(err, user);
            });
        }
        
        else if(user.checkAuthor == "Reviewer")
        {
            console.log("this is the reviewer checkauthor",user.checkAuthor);
            Reviewer.findById(user.id, function(err, user){
                done(err, user);
            });
        }

        else if(user.checkAuthor == "Admin")
        {
            console.log("this is the admin checkauthor",user.checkAuthor);
            Admin.findById(user.id, function(err, user){
                done(err, user);
            });
        }
        
    });

    // passport.deserializeUser(function(id, done){
    //     Reviewer.findById(id, function(err, user){
    //         done(err, user);
    //     });
    // });

    ///////STRATEGIES FOR AUTHOR////////////////////////

    passport.use('local-author-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // entire request can be passed to the callback
    },

    function(req, email, password, done){
        console.log("Reached this function");
        process.nextTick(function(){
            console.log("Reached this inner function");
            User.findOne({'local.email': email}, function(err, user){

                //check for errors
                if(err){
                    return done(err);
                }

                //User with the same email
                if (user) {
                    console.log("Same email");
                    return done(null, false, req.flash('signupMessage', 'This email is not available.'));
                }

                //No user with this email so create account
                else {
                    console.log("Valid Email");
                    var newUser= new User();
                    var pn_a= new PhoneNumber( req.body.mobile, req.body.country_code);
                    newUser.local.name= req.body.fname+' '+req.body.mname+' '+req.body.lname;
                    newUser.local.gender= req.body.gender;
                    // newUser.local.mobile= pn_a.getNumber();
                    newUser.local.mobile= req.body.country_code+req.body.mobile;
                    console.log(newUser.local.mobile);
                    newUser.local.orgname= req.body.orgname;
                    newUser.local.orgadd= req.body.orgadd;
                    newUser.local.email= email;                    
                    newUser.local.password= newUser.generateHash(password);
                    newUser.local.role = "Author";
                    newUser.local.blockedStatus = 0; //0 - unblocked, 1 - blocked

                    newUser.save(function(err){
                        if(err){
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('local-author-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // entire request can be passed to the callback
    },
    
    function(req, email, password, done){
        User.findOne({'local.email': email}, function(err, user){
            if(err)
            {
                return done(err);
            }

            if(!user) //no user found, invalid email id
            {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if(!user.validPassword(password)) //email id found but password is incorrect
            {
                return done(null, false, req.flash('loginMessage', 'The password entered is wrong.'));
            }
            console.log("In author login ", user);
            return done(null, user);  //credentials are right
        });
    }));

    ///////STRATEGIES FOR REVIEWER////////////////////////

    passport.use('local-reviewer-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // entire request can be passed to the callback
    },

    function(req, email, password, done){
        // console.log("Reached this function");
        process.nextTick(function(){
            // console.log("Reached this inner function");
            Reviewer.findOne({'local.email': email}, function(err, user){

                //check for errors
                if(err){
                    return done(err);
                }

                //User with the same email
                if (user) {
                    console.log("Same email");
                    return done(null, false, req.flash('signupMessage', 'This email is not available.'));
                }

                //No user with this email so create account
                else {
                    console.log("Valid Email for reviewer");
                    var newReviewer= new Reviewer();
                    // var pn_r= new PhoneNumber( req.body.mobile, req.body.country_code);
                    // console.log("pn_r ",pn_r);
                    newReviewer.local.name= req.body.fname+' '+req.body.mname+' '+req.body.lname;
                    newReviewer.local.gender= req.body.gender;
                    newReviewer.local.mobile= req.body.country_code+req.body.mobile;
                    // console.log("newReviewer.local.mobile ",newReviewer.local.mobile);
                    newReviewer.local.orgname= req.body.orgname;
                    newReviewer.local.orgadd= req.body.orgadd;
                    newReviewer.local.status= 0; //0 - not yet accepted by admin, account inactive ; 1 - accepted by admin, account activated
                    newReviewer.local.email= email;                    
                    newReviewer.local.password= newReviewer.generateHash(password);
                    newReviewer.local.role= "Reviewer";                    
                    newReviewer.local.blockedStatus = '0'; //0 - unblocked, 1 - blocked
                    newReviewer.local.keywords = req.body.keywords;
                    
                    newReviewer.save(function(err){
                        if(err){
                            throw err;
                        }
                        
                        console.log(newReviewer);
                        return done(null, newReviewer);
                    });
                }
            });
        });
    }));

    passport.use('local-reviewer-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // entire request can be passed to the callback
    },
    
    function(req, email, password, done){

        Reviewer.findOne({'local.email': email}, function(err, user){
            console.log(email);
            if(err)
            {
                return done(err);
            }

            if(!user) //no user found, invalid email id
            {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if(!user.validPassword(password)) //email id found but password is incorrect
            {
                return done(null, false, req.flash('loginMessage', 'The password entered is wrong.'));
            }
            console.log("In reviewer login ", user);
            return done(null, user); //credentials are right
        });
    }));

    ///////STRATEGIES FOR ADMIN////////////////////////

    passport.use('local-admin-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // entire request can be passed to the callback
    },
    
    function(req, email, password, done){

        Admin.findOne({'local.email': email}, function(err, user){
            if(err)
            {
                return done(err);
            }

            if(!user) //no user found, invalid email id
            {
                // var something= "hi";
                console.log(email);
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            if(!user.validPassword(password)) //email id found but password is incorrect
            {
                return done(null, false, req.flash('loginMessage', 'The password entered is wrong.'));
            }
            console.log("In admin login ", user);
            return done(null, user);  //credentials are right
        });
    }));

};