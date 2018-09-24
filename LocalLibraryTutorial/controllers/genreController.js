var async = require('async');

var db_genreModel = require('../models/genreModel');

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
exports.genre_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
    async.parallel({
        // Async Tasks
        Genre_Book: function(callback) {

        },
        Genre: function(callback) {

        }
    }, function(err, results){
        // Callback Handler
        if(err) { return next(err); }

        
    })
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
};