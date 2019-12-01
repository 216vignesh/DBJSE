var express = require('express');
var app = express();
var paperRouter = express.Router();
var formidable = require('formidable');

// Require Item model in our routes module
var Paper = require('../app/models/paper.js');
var Reviewer = require('../app/models/reviewer.js');

// Defined Add route
paperRouter.route('/add').get(function (req, res) {
  res.render('author/addPaper', {
    req: req
  });
});

// Defined store route
paperRouter.route('/add/post').post(function (req, res) {
  
  var paper = new Paper(req.body);

  paper.paper_id = paper._id;
  var id = paper.paper_id;

  paper.paper_author_id = req.user.id;
  
  var keywords = req.body.keywords;
  paper.paper_keywords = keywords;

  //***************************************************************************************
  //*****************************  REVIEWER-PAPER ASSIGNMENT  *****************************
  //***************************************************************************************

  tags = keywords; //fetch paper tags and store in variable
  var count = []; //initialise count variable for storing count of how many tags matched
  var rev_id = [];

  Reviewer.find(function (err, reviewer) {
    
    if (err) {
      console.log(err);
    } 
    
    else {
      for (var i = 0; i < tags.length; i++) {

        var j=0;
        reviewer.forEach(function(reviewer){
          
          count[j] = 0;
          rev_id[j] = reviewer._id;
          id = reviewer._id;

          console.log("J_out is "+j+"\n\n");

              for (var k = 0; k < reviewer.local.keywords.length; k++) {

                console.log("\nTag "+ i +" = " + tags[i] + "\n");
                console.log("Rev KW " + k + " = " + reviewer.local.keywords[k] + "\n\n\n");

                if (tags[i].localeCompare(reviewer.local.keywords[k])) {
                  console.log("J_in is "+j+"\n\n");
                  count[j]+=1;
                  console.log(count[j]);
                }
              }
          j+=1;    
        });
      }

      console.log("Count array is "+count+"\n\n");

          var Max = Math.max.apply(Math, count); // find index of max element
          var indexOfMax = count.indexOf(Math.max.apply(Math, count)); // find index of max element

          console.log("mahamax is " + Max + "\n\n");
          console.log("index of mahamax is " + indexOfMax+"\n\n");
          
          final_rev_id = rev_id[indexOfMax]; //id of reviewer to whom paper is being assigned
          
          console.log("Final rev id is "+final_rev_id);
        
        paper.assignedTo = final_rev_id;

      rev =  Reviewer.findById(final_rev_id, function (err, rev) {
          console.log("***************** THE REVIEWER NAME IS " + rev.local.name + "*****************\n\n");
          final_rev_name = rev.local.name;
        });

        paper.save();

        //########################################################################################################
        // CURRENTLY, I AM ONLY CONSIDERING THE MAX NO OF TAG MATCHES AND ASSIGNING PAPER TO THAT REVIEWER, 
        // THIS NEEDS BETTERMENT BECAUSE IT MAY LEAD TO STARVATION. ONLY ONE REVIEWER MAY END UP GETTING 
        // ALL PAPERS FOR REVIEW
        //########################################################################################################

        // if(reviewer[x].local.assignedpapers == 0){
        // }
        // }

    }
      
    });
  
    res.redirect('/author/papers/add/post/uploadfile/' +id);
  
  });
  
  //Load Paper Upload Page
paperRouter.route('/add/post/uploadfile/:id').get(function (req, res) {
  
  var idvalue = req.params.id;
  res.render('author/uploadfile', {id: idvalue, req: req});

});

//Upload The File
paperRouter.post('/upload/:id', function (req, res) {
  var form = new formidable.IncomingForm();

  var idvalue = req.params.id +'.pdf';
  form.parse(req);

  form.on('fileBegin', function (name, file) {
      file.path = './public/uploads/' + idvalue;
  });

  form.on('file', function (name, file) {
      console.log('Uploaded ' + file.name);
  });

  res.redirect('/author/papers');
});



// Defined get data(index or listing) route
paperRouter.route('/').get(function (req, res) {
  Paper.find(function (err, paprs){
    if(err){
      console.log(err);
    }
    else {
      res.render('author/papers', {
        paprs: paprs,
        authorid: req.user, 
        req: req
      });
    }
  });
});

// Defined edit route
paperRouter.route('/edit/:id').get(function (req, res) {
  var id = req.params.id;
  Paper.findById(id, function (err, paper){
      res.render('author/editPaper', {paper: paper, req: req});
  });
});

//  Defined update route
paperRouter.route('/update/:id').post(function (req, res) {
  Paper.findById(req.params.id, function(err, paper) {
    if (!paper)
      return next(new Error('Could not load Document'));
    else {
      // do your updates here
      paper.paper_title = req.body.paper_title;
      paper.paper_author = req.body.paper_author;

      paper.save().then(paper => {
          res.redirect('/author/papers');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
paperRouter.route('/delete/:id').get(function (req, res) {
  Paper.findByIdAndRemove({_id: req.params.id},
	   function(err, paper){
		if(err) res.json(err);
		else res.redirect('/author/papers');
	});
});

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



module.exports = paperRouter;
