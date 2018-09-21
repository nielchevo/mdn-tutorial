
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
    // Convert genre checkbox body view to an array
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
    (req, res, next) => {

        const errors = validationResult(req);
        
        let create_book = new db_bookModel({ 
                                        title: req.body.title,
                                        author: req.body.author,
                                        summary: req.body.summary,
                                        isbn: req.body.isbn,
                                        genre: req.body.genre
        });

        if (!errors.isEmpty()) {
            //handle error sanitize & validation

            // if error then re-render author and genre form.
            async.parallel({
                authors: function(callback) {
                    db_authorModel.find(callback);
                },
                genres: function(callback) {
                    db_genreModel.find(callback);
                }
            }, function(err, results) {
                // Async callback handle 
                if(err) {
                    return next(err);
                }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }

                res.render('create_book', { title: 'Create Book',
                                            authors:results.authors, 
                                            genres:results.genres, 
                                            book: create_book, 
                                            errors: errors.array() 
                                        });
            });
            return;

        } else {
            create_book.save( function(err, results) {
                if (err) {
                    return next(err);
                }
                // Success. then redirect to book url
                res.redirect(create_book.url);
            });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res, next) {
    let bookId = req.params.id;

    async.parallel({
        Book: function(callback){
            db_bookModel.findById(bookId )
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        Book_Instances: function(callback) {
            db_bookInstanceModel.find({'book': bookId})
                .exec(callback);
        }
    }, function(err, results) {
        // Async callback handler
        if(err) {
            return next(err);
        }
        // Success. then render delete view 
        res.render('delete_book', {title: 'Delete Book',
                                    book: results.Book,
                                    book_instances: results.Book_Instances,
                                    error: err
                                })
    });
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res, next) {
    let bookId = req.params.id;

    async.parallel({
        // Async tasks
        Book: function(callback) {
            db_bookModel.findById(bookId)
               .populate('author')
               .populate('genre')
               .exec(callback);
        },
        Book_Instances: function(callback) {
            db_bookInstanceModel.find({'book': bookId})
               .exec(callback);
        }
    }, function(err, results) {
        // Async callback handler
        if(err) {
            return next(err);
        }

        if(results.Book_Instances.length >= 1) {
            // if book has instances, notice to view to remove the book instances first.
            res.render('delete_book', {title: 'Delete Book',
                                      book: results.Book,
                                      book_instances: results.Book_Instances,
                                      error: err 
            });
        }
        else {
            // Delete the book by book ID
            db_bookModel.findByIdAndRemove({'_id':bookId}, {}, function deleteBook(err, result) {
                if(err) {
                    return next(err);
                }

                // Success. Redirect to book lists view
                res.redirect('/books');
            });
        }

    });

};

// Display book update form on GET.
exports.book_update_get = function(req, res, next) {
    async.parallel({
        // Async Tasks
        Book: function(callback) {
            db_bookModel.findById(req.params.id)
              .populate('genre')
              .exec(callback);
        },
        Author : function(callback) {
            db_authorModel.find({})
              .exec(callback);
        },
        Genre: function(callback) {
            db_genreModel.find({})
              .exec(callback);
        }
    }, function(err, results) {
        // Async callback handler
        if(err) {
            return next(err);
        }

        if(results.Book == null)
        {
            var error = new Error('Book Not Found !!');
            err.status = 404;
            return next(err);
        }

        // To mark check the genres of the book
        for(let allGenre_Iter=0; allGenre_Iter < results.Genre.length; allGenre_Iter++) {
            for (let Book_Iter = 0; Book_Iter < results.Book.genre.length; Book_Iter++) {
                if(results.Genre[allGenre_Iter]._id.toString() == results.Book.genre[Book_Iter]._id.toString()) {
                    results.Genre[allGenre_Iter].checked ='true';
                }
            }
        }

        // Success. then render to view
        res.render('create_book', { title: 'Update Book', 
                                    book: results.Book,
                                    authors: results.Author,
                                    genres: results.Genre,
                                    error: err                          
                                });
    });
};

// Handle book update on POST.
exports.book_update_post = [ 
    
    // GET and convert genre checkbox to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
                req.body.genre=[];
            else
                req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate body Form fields
    body('title', 'Title must not be empty !').isLength({min: 1}).trim(),
    body('author', 'Author must not be empty !').isLength({min: 1}).trim(),
    body('summary', 'Summary must not be empty !').isLength({min: 1}).trim(),
    body('isbn', 'isbn must not be empty').isLength({min: 1}).trim(),

    // sanitize 
    sanitizeBody('*').trim().escape(),
    sanitizeBody('genre.*').trim().escape(),

    (req, res, next) => {
        let bookId = req.params.id; // temp book id
        const errors = validationResult(req);

        let create_book = new db_bookModel({
                            title: req.body.title,
                            author: req.body.author,
                            summary: req.body.summary,
                            isbn: req.body.isbn,
                            genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre, // sanity checking i guess..
                            _id: bookId     // This is required, or a new ID will be assigned!
        })

        if(!errors.isEmpty()){
            // Error found. render back with sanitized and validated form & Error message
            res.render('create_book', {title: 'Update Book Detail',
                                        error: errors.array(),
                                        book: results.Book,
                                        authors: results.Author,
                                        genres: results.Genre,
            });
        }
        else {
            db_bookModel.findByIdAndUpdate( bookId, 
                                            create_book, 
                                            {}, 
                                            function (err, resultsUpdated) {
                if(err) { 
                    return next(err);
                }
                // Success redirect to url
                res.redirect(resultsUpdated.url)
            })
        }
    }
];

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
