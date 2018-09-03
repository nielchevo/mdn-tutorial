var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var book_schema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String },
    ISBN: {type: String, require: true},
    genre: {type: Schema.Types.ObjectId, ref: 'Genre'}

});


//virtual for book's URL
book_schema.virtual('URL').get(function() {
    return '/book/'+ this._id;
});

//Exports model
module.exports = mongoose.model('Book', book_schema);

