var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dbjse');
var db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected") ;
});
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var reviewerSchema = new mongoose.Schema({

    local: {
        name: String,
        gender: String,
        mobile: String,
        orgname: String,
        orgadd: String,
        status: Number,  //Status will be modified by the admin when he gives the reviwer an okay
        email: String,
        password: String,
        role: String,
        blockedStatus: String,
        keywords: Array
    }

}, {collection: 'Reviewer'});

// generating a hash
reviewerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
reviewerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for reviwers and expose it to our app
module.exports = mongoose.model('Reviewer', reviewerSchema);
