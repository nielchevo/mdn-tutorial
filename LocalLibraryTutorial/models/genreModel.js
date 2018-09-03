var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var genre_schema = new Schema({
    name: {type: String, minlength: 3 , maxlength: 100}
});


//virtual for genre's URL
genre_schema.virtual('url').get(function() {
    return '/genre/'+ this._id;
});

//Exports model
module.exports = mongoose.model('Genre', genre_schema);