var async = require('async');

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

// Author create GET 
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED : Author Create GET');
};
// Author create POST
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author Create POST');
}

// Author DELETE GET 
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED : Author Delete GET');
};
// Author DELETE POST
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author Delete POST');
}

// Author UPDATE GET 
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED : Author UPDATE GET');
};
// Author UPDATE POST
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author UPDATE POST');
}

exports