var async = require('async');

// validator and sanitize lib
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// importing author database
var db_authorModel = require('../models/authorModel');
var db_bookModel = require('../models/bookModel');

/* author Controller Functions */
exports.author_list = function(req, res) {
    db_authorModel.find()
        .sort([['family_name', 'ascending']])
        .exec(function(err, results) {
            if(err) {return next(error); }
            // success, render data
            res.render('list_author', {title: 'Author Lists', error: err, Author_List: results});
        });
};

// Author create GET 
exports.author_create_get = function(req, res, next) {
    res.render('create_author', {title: 'Create Author form'});
};

// Author create POST
exports.author_create_post = [
    // get item from body
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    //validate
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),
    
    // Process handle after validation and sanitization 
    (req, res, next) => {
        const error = validationResult(req);

        if( !error.isEmpty() ) {
            // There are errors, Render again with sanitize values / error message.
            res.render('create_author', {title: 'Create Author form', author: req.body, errors: error.array()});
            return;
        } else {

            let create_author = new db_authorModel({
                first_name  : req.body.first_name,
                family_name : req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });

            create_author.save(function (err) {
                if(err) { return next(err); }
                // successful, redirect to Author detail page
                res.redirect(create_author.url);
            });
        }
    }
];

// Author DELETE GET 
exports.author_delete_get = function(req, res, next) {
    async.parallel({
        author: function(callback) {
            db_authorModel.findById(req.params.id)
                .exec(callback);
        },
        author_book: function(callback) {
            db_bookModel.find({'author': req.param.id}, 'title summary')
                .exec(callback);
        }
    }, 
    function(err, results) {
        /* async callback handler */
        if(err) { return next(err); }
        // Success. then render to delete author page
        res.render('delete_author', { title:'Delete Author', 
                                      error: err,
                                      Author: results.author,
                                      Author_Books: results.author_book
        })
    });  
};

// Author DELETE POST
exports.author_delete_post = function(req, res, next) {
    let authorId = req.body.authorid;

    async.parallel({
        author: function(callback) {
            //db_authorModel.find({'author': authorId })
            db_authorModel.findById(authorId)
                .exec(callback);
        },
        author_book: function(callback) {
            db_bookModel.find({'author': authorId})
                .exec(callback);
        }
    }, function(err,  results) {
        /* Async callback handler */
        if(err) { return next(err) ;}
        // Success. then proceed delete
        
        if(results.author_book.isLength >= 1) {
            // Author has book, render the same way as GET route 
            res.render('delete_author', { title:'Delete Author', 
                                            error: err,
                                            Author: results.author,
                                            Author_Books: results.author_book 
            }) 
        }
        else {
            // Author has NO books, proceed delete.
            db_authorModel.findByIdAndRemove((authorId), function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success. then redirect to author lists
                res.redirect('/authors');
            })
        }
    })
}

// Author UPDATE GET 
exports.author_update_get = function(req, res, next) {
    let authorId = req.params.id;

    db_authorModel.findById(authorId)
        .exec(function(err, author) {
            if(err) {
                return next(err);
            }

            if(author == null) {
                var error = new Error('Author Not Found');
                err.status = 404;
                return next(err);
            } 

            // Success. render author detail by ID
            res.render('create_author', {title: 'Update Author',
                                        error: err, 
                                        author: author});
        });
};

// Author UPDATE POST
exports.author_update_post = [
  
    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),
    
    (res, req, next) => {
        
        const error = validationResult(req);

        let author_update = new db_authorModel({
            first_name  : req.body.first_name,
            family_name : req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: req.params.id
        });

        if( !error.isEmpty() ) {
            // There are errors, Render again with sanitize values / error message.
            res.render('create_author', {title: 'Update author form', author: req.body, errors: error.array()});
            return;
        }
        else {
            author_update.findByIdAndUpdate(authorId, {}, function(err, updateAuthor) {
                if(err) { return next(err); }
                // Success. then update to db
                res.redirect(updateAuthor.url);
            });
        }
    }
];

exports.author_detail = function(req, res, next){
    async.parallel({
        author: function(callback) {
            db_authorModel.findById(req.params.id)
                .exec(callback);
        },
        author_books: function(callback ) {
            db_bookModel.find({'author': req.params.id}, 'title summary')
                .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        
        if(results.author == null) {
            var error = new Error('Author Not Found');
            err.status = 404;
            return next(err);
        } 
        
        // Success, then render
        res.render('detail_author', {title:'Author Bio Details', err: error, Author_Detail: results.author, Author_Detail_Book: results.author_books});
    })
}

exports