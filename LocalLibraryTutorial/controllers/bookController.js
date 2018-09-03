var async = require('async');

// importing book database
var db_bookModel = require('../models/bookModel');
var db_bookInstanceModel = require('../models/bookInstanceModel');
var db_authorModel = require('../models/authorModel');
var db_genreModel = require('../models/genremodel');

/* book  Controller Functions */
// Render Handle for index.pug page
exports.index = function(req, res) {
    async.parallel({
        book_count: function(callback) {
            db_bookModel.countDocuments(callback);
        },
        book_instance_count: function(callback) {
            db_bookInstanceModel.countDocuments(callback);
        },
        book_instance_available_count: function(callback) {
            db_bookInstanceModel.countDocuments({status: 'Available'}, callback);
        },
        book_instance_loaned_count: function(callback) {
            db_bookInstanceModel.countDocuments({status: 'Loaned'}, callback);
        },
        book_instance_maintenance_count: function(callback) {
            db_bookInstanceModel.countDocuments({status: "Maintenance"}, callback);
        },
        author_count: function(callback) {
            db_authorModel.countDocuments(callback);
        },
        genre_count: function(callback) {
            db_genreModel.countDocuments(callback);
        }
    }, function(err, results) {
        // render data to index
        res.render('index', {title: 'Local Library Home', error: err, data: results});
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {

    db_bookModel.find({}, 'title')
        .populate('author')
        .exec(function(err, list_books) {
            if(err) { return next(err); }
            // Successfull, so render back to 'list_book' page
            res.render('list_book', {title:'Book Lists', book_list: list_books});
        });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};