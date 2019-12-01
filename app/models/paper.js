// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// // Define collection and schema for Items
// var Paper = new Schema({
//     paper_name: {
//         type: String, default: 'Paper Name'
//     },
//     paper_author: {
//         type: String, default: 'Author Name'
//     },
//     path: { type: String },
//     paper_date: {
//         type: Date, default: Date.now
//     },

// }, {
//         collection: 'papers'
//     });

// module.exports = mongoose.model('Paper', Paper);


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define collection and schema for Items
var Paper = new Schema({
  paper_title: {
    type: String, default: 'Paper Title'
  },
  paper_author: {
    type: String, default: 'Author Name'
  },
  paper_author_id: {
    type: String,
  },
  paper_abstract: {
    type: String, default: 'Abstract'
  },
  paper_keywords: {
    type: Array
  },
  paper_id: {
    type: String, default: 'ID'
  },
  path:  { type: String },
  paper_date: {
    type: Date, default: Date.now
  },

  assignedTo: { //name of reviewer the paper is assigned to
    type: String
  }

},{
	collection: 'papers'
});

module.exports = mongoose.model('Paper', Paper);
