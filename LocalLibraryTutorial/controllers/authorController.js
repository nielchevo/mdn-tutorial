// importing author database
var authorModel = require('../models/authorModel');


/* author Controller Functions */
exports.author_list = function(req, res) {
    res.send('NOT YET IMPLEMENTED: Author Lists');
};

exports.author_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail');
};

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