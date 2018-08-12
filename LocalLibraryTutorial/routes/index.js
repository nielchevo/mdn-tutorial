var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Local Library'});
});

// TODO: do a MVC model
/* Books page Routes */

router.get('/books', function(req, res, next) {
  res.render('list_book', {title: 'Book List'});
});

router.get('/book/add', function(req, res, next) {
  res.render('create_book', {title: 'Create book'});
});


/* Authors page Routes*/

router.get('/authors', function(req, res, next) {
  res.render('list_author', {title: 'Author list'});
});

router.get('/author/add', function(req, res, next) {
  res.render('create_author', {title: 'Create Author'});
});


/* Genres page Routes*/

router.get('/genres', function(req, res, next) {
  res.render('list_genre', {title: 'Genre List'});
});

router.get('/genre/add', function(req, res, next) {
  res.render('create_genre', {title: 'create genre'});
});


/* Book Instance page Routes*/

router.get('/bookinstance', function(req, res, next) {
  res.render('list_bookinstance', {title: 'Book Instance List'});
});

router.get('/bookinstance/add', function(req, res, next) {
  res.render('create_bookinstance', {title: 'create book instance'});
});

module.exports = router;
