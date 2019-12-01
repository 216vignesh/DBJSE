var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dbjse');
var db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected in admin model") ;
});
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var adminSchema = new mongoose.Schema({

    local: {
        email: String,
        password: String,
        role: String,
    }

}, {collection: 'Admin'});

// generating a hash
adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for admin and expose it to our app
module.exports = mongoose.model('Admin', adminSchema);
