var async = require('async');

const { body, validationResult } = require('express-validator/check'); 
const { sanitizeBody } = require('express-validator/filter');

var db_genreModel = require('../models/genreModel');
var db_bookModel = require('../models/bookModel');

/* genre Controller Functions */
// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    db_genreModel.find({})
        .sort([['name', 'ascending']])
        .exec(function(err, results) {
            if(err) {return next(err); }

            // Success. then render to view
            res.render('list_genre', {title: 'List of Genre',
                                    error: err,
                                    list_genres: results
                                    });
        });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
    res.render('create_genre', {title: 'Create a Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [

    body('name', 'Name must not be empty!').isLength({min: 1}).trim(),
    body('name', 'Name must Contain at least 3 character').isLength({min: 3}).trim(),
    
    sanitizeBody('name').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        let create_genre = new db_genreModel({
                                            name: req.body.name    
                            });

        if(!errors.isEmpty()){ 
            // handle error
            
            // return with GET view and send error message
            res.render('create_genre', {title: 'Create a Genre',
                                        errors: errors.array()
            });

        } else {
            // save to db
            create_genre.save( function(err, saveResults) {
                if(err) {
                    return next(err);
                }    
                // Success. redirect to view
                res.redirect(create_genre.url);
            });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
    let genreId = req.params.id;

    async.parallel({
        // Async Tasks
        Genre_Book: function(callback) {
            db_bookModel.find({'genre': genreId}, 'title summary url')
                .exec(callback);
        },
        Genre: function(callback) {
            db_genreModel.findById(genreId)
                .exec(callback);
        }
    }, function(err, results){
        // Callback Handler
        if(err) { return next(err); }

        res.render('delete_genre', {title:'Delete a Genre',
                                    error: err,
                                    genre_books: results.Genre_Book,
                                    genre: results.Genre
        });
    });
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {
    let genreId = req.params.id;

    async.parallel({
        // Async tasks
        Genre: function(callback) {
            db_genreModel.findById(genreId)
                .exec(callback);
        }
    }, function(err, results) {
        // Callback handler
        if(err) { 
            return next(err);
        }

        // Success. then render to view.
        res.render('create_genre', {title: 'Update Genre',
                                    errors: err,
                                    genre: results.Genre
        });
    });
};

// Handle Genre update on POST.
exports.genre_update_post = [
    body('name', 'Name must not be empty!').isLength({min: 1}).trim(),
    body('name', 'Name must Contain at least 3 character').isLength({min: 3}).trim(),
    
    sanitizeBody('name').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        
        let genreId = req.params.id;

        let update_genre = new db_genreModel({
                                            name: req.body.name,
                                            _id : genreId
                            });
        
        if(!errors.isEmpty()) {
            // Error handle 

            res.render('create_genre', {title: 'Update Genre',
                                        errors: errors.array(),
                                        genre: genre,
                                        _id: genreId 
            });
        } else {
            db_genreModel.findByIdAndUpdate(genreId,
                                            update_genre,
                                            {},
                                            function(err, updateResults) {

                if(err) { 
                    return next(err);
                }
                // Success. then update and redirect.
                res.redirect(updateResults.url);
            });
        }
    }
];

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    let genreId = req.params.id;

    async.parallel({
        // Async Tasks
        Book_Genre: function(callback){
            db_bookModel.find({'genre': genreId}, 'title summary url')
                .exec(callback);
        },
        Genre: function(callback){
            db_genreModel.findById(genreId)
                .exec(callback);
        }
    }, function(err, results) {
        // Callback Handle
        if(err) {
            return next(err);
        }   

        // Success. then render to view
        res.render('detail_genre', {title: 'Detail Genre',
                                    error: err,
                                    genre_books: results.Book_Genre,
                                    genre: results.Genre                        
        });
    });
};