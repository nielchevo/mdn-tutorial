var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var book_schema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String },
    isbn: {type: String, require: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]

});

//virtual for book's URL
book_schema.virtual('url').get(function() {
    return '/book/'+ this._id;
});

//Exports model
module.exports = mongoose.model('Book', book_schema);

