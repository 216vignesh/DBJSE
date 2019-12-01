var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dbjse');
var db= mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected") ;
});
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = new mongoose.Schema({

    local: {
        name: String,
        gender: String,
        mobile: String,
        orgname: String,
        orgadd: String,
        email: String,
        password: String,
        role: String,
        blockedStatus: String
    }

}, {collection: 'Author'});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
