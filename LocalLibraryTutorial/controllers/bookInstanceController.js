var async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// importing book instance database
var db_bookInstanceModel = require('../models/bookInstanceModel');
var db_bookModel = require('../models/bookModel');

/* book instance Controller Functions */
// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    db_bookInstanceModel.find({})
        .exec(function(err, book_instance_list) {
            if(err) {return next(err);}
            // Success. then render to detail view. 
            res.render('list_bookinstance', {title:'List of all book instance', 
                                            error:err, 
                                            bookinstance_list: book_instance_list
            });
        });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    async.parallel({
        // Async Tasks
        Book: function(callback) {
            db_bookModel.find({},'title _id')
                .exec(callback);
        }
    }, function(err, results) {
        // Callback Handler
        if(err) {
            return next(err);
        }
        res.render('create_bookinstance', { title: 'Create a New book instance', 
                                            error: err,
                                            book_list: results.Book});
        });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        let create_bookInstance = new db_bookInstanceModel({ 
                                    book: req.body.book,
                                    imprint : req.body.imprint,
                                    status: req.body.status,
                                    due_back: req.body.due_back
        });
        
        if(!errors.isEmpty()) {
            // Handle error
            db_bookModel.find({},'title _id')
                .exec(function(err, results) {
                    if(err) { return next(err); }
                    res.render('create_bookinstance', { title: 'Create a Book Instance', 
                                                        errors: errors.array(),
                                                        book: results.book,
                                                        selected_book: results.book._id,
                                                        bookinstance : bookinstance
                    });
                });
        } else {
            create_bookInstance.save(function(err, saveResults) {
                if(err) { return next(err); }
                // Success. then render to view
                res.redirect(saveResults.url);
            });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {
    
    let bookInstanceId = req.params.id;

    async.parallel({
        // Async Tasks
        Book_Instance: function(callback) {
            db_bookInstanceModel.findById(bookInstanceId)
                .populate({path:'book',select:'_id url title'})
                .exec(callback);
        },
    }, function(err, results) {
        // Callback Handler
        if(err) { return next(err); }

        res.render('delete_bookinstance', { title: 'Delete a Book Instance',
                                            bookinstance: results.Book_Instance,
                                            error : err
        });
    });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
    let bookInstanceId = req.params.id;

    db_bookInstanceModel.findByIdAndRemove(bookInstanceId, function(err, deleteResult) {
                    if(err) {return next(err); }
                    // SUccess delete. then redirect.
                    res.redirect('/bookinstance');
    });
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res, next) {
    async.parallel({
        // Async Tasks
        Book: function(callback) {
            db_bookModel.find({}, 'title _id')
                .exec(callback);
        },   
        Book_Instance: function(callback) {
            db_bookInstanceModel.findById(req.params.id)
                .populate({path:'book', select:'_id title'})
                .exec(callback);
        }
    }, function(err, results) {
        // Callback Handle
        if(err) {return next(err); }
        
        // Success. then render to update view.
        res.render('create_bookinstance', {title:'Update the book instance', 
                                            bookinstance : results.Book_Instance,
                                            book_list: results.Book,
                                            error: err
        })
    });
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    (req, res, next) => {
        const errors = validationResult(req);
        let bookInstanceId= req.params.id;
        
        let update_bookInstance = new db_bookInstanceModel({    book: req.body.book,
                                                                imprint : req.body.imprint,
                                                                status: req.body.status,
                                                                due_back: req.body.due_back,
                                                                _id: bookInstanceId
                                                            });

        if(!errors.isEmpty()) {
            async.parallel({
                // Async Tasks
                Book: function(callback) {
                        db_bookModel.find({}, 'title _id')
                            .exec(callback);
                },   
            }, function(err, results) {
                // Callback handler
                if(err) { return next(err); }

                res.render('create_bookinstance', { title: 'Update Book instance', 
                                                    errors: errors.array(),
                                                    book: results.Book,
                                                    selected_book: bookinstance.book._id,
                                                    bookinstance: bookinstance,
                });
            });
        } else {
            db_bookInstanceModel.findByIdAndUpdate( bookInstanceId, 
                                                    update_bookInstance,
                                                    {},
                                                    function(err, updateResult) {
                                                    if(err) { return next(err); }
                                                    // Success. then redirect to url
                                                    res.redirect(updateResult.url); 

            });
        }
    }

];

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    db_bookInstanceModel.findById(req.params.id)
        .populate('book')
        .exec(function (err, results) {
          if(err) {
              return next(err);
          }  
          // Succeess. send to detail view
          res.render('detail_bookinstance', { title: 'Book detail', 
                                              error: err,
                                              bookinstance: results
                                            });
        });
};
