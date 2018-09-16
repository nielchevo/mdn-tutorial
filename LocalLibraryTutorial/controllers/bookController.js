
// importing book database
var db_bookModel = require('../models/bookModel');
var db_bookInstanceModel = require('../models/bookInstanceModel');
var db_authorModel = require('../models/authorModel');
var db_genreModel = require('../models/genreModel');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

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

    db_bookModel.find({}, 'title author')
        .populate('author')
        .exec(function(err, list_books) {
            if(err) { return next(err); }
            // Successfull, so render back to 'list_book' page
            res.render('list_book', {title:'Book Lists', book_list: list_books});
        });
};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {

    async.parallel({
        authors: function(callback) {
            db_authorModel.find(callback);
        },
        genres: function(callback) {
            db_genreModel.find(callback);
        },
    }, function (err, results) {
        // Async handle callback
        if(err) {
            return next(err);
        }
        
        res.render('create_book', { title: 'Create Book',
                                    authors: results.authors,
                                    genres: results.genres,
                                });
    });
};

// Handle book create on POST.
exports.book_create_post = [
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields
    body('title', 'Title must not be empty!').isLength({min: 1}).trim(),
    body('author', 'Author must not be empty!').isLength({min: 1}).trim(),
    body('summary', 'Summary must not be empty!').isLength({min: 1}).trim(),
    body('isbn', 'ISBN must not be empty!').isLength({min: 1}).trim(),

    //sanitize fields
    sanitizeBody('*').trim().escape(),
    sanitizeBody('genre.*').trim().escape(),

    // Proceed to db ater valid and sanitized
    (res, req, next) => {

        const errors = validationResult(req);
        
        let book_input = new db_bookModel({ 
                                        title: req.body.title,
                                        author: req.body.author,
                                        summary: req.body.summary,
                                        isbn: req.body.isbn,
                                        genre: req.body.genre
        });

        if (!errors.isEmpty()) {

            async.parallel({
                authors: function(callback) {
                    db_authorModel.find(callback);
                },
                genres: function(callback) {
                    db_genreModel.find(callback);
                }
            }, function(err, results) {
                // Async callback handler.
                if(err) {return next(err); }

                // Mark our selected genres as checked
                for (let i = 0; i < results.genres.length; i++) {
                    if(book.genre.indexOf(results.genre[i]._id) > -1) {
                        results.genre[i].checked = 'true';
                    }
                }
                res.render('create_book', { title: 'Create Book', 
                                            book: results.book, 
                                            authors: results.authors,
                                            genre: results.genres, 
                                            errors: errors.array() 
                                        });
            });
        }
        else {
           // No errors the proceed save to db. 
            book_input.save( function(err) {
                if(err) { return next(err); }
                // Success. redirect to main page
                res.redirect(db_bookModel.url);
            });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res, next) {
    res.render('delete_book', {title: 'Delete a book'});
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

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    let bookId = req.params.id;

    async.parallel({
        book_func: function(callback) {
            db_bookModel.findById(bookId)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        book_instance_func: function(callback) {
            db_bookInstanceModel.find({'book': bookId}, 'status due_back')
                .exec(callback);    
        }

    }, function(err, results) {
        // Async callback   
        if (err) { return next(err); }

        if(results.book_func == null) {
            let err = new Error('Book not found!');
            err.status = 404;
            return next(err);
        }

        res.render('detail_book', { title:'Book Detail', 
                                    error: err,
                                    book: results.book_func, 
                                    book_instances: results.book_instance_func
        })        
    })
};
