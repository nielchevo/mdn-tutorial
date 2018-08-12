var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bookInstance_schema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint : {type: String, required: true},
    status: {type: String, required: true },
    due_date: {type: Date, required: true},

});


// Virtual for GET book instance's URL 
bookInstance_schema.virtual.get(function() {
    return '/bookInstance/'+ this._id;
});

module.exports = mongoose.model('BookInstance', bookInstance_schema);