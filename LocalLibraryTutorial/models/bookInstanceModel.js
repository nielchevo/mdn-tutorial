var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var bookInstance_schema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book', required: true},
    imprint : {type: String, required: true},
    status: {type: String, required: true, enum:['Available', 'Maintenance', 'Loaned', 'Reserved'], default:'Maintenance'},
    due_back: {type: Date, default: Date.now }
});

// Virtual for GET book instance's URL 
bookInstance_schema.virtual('url').get(function() {
    return '/bookInstance/'+ this._id;
});

// Vitual for GET due back Date formated
bookInstance_schema
.virtual('due_back_formatted')
.get(function () {
  return moment(this.due_back).format('MMMM Do, YYYY');
});

bookInstance_schema
.virtual('due_back_yyyy_mm_dd')
.get(function () {
  return moment(this.due_back).format('YYYY-MM-DD');
});


module.exports = mongoose.model('BookInstance', bookInstance_schema);