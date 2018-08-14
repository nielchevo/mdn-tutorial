var express = require('express');
var router = express.Router();

/* Controllers */
var authorController = require('../controllers/authorController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Local Library'});
});

/* Books page Routes */
router.get('/books', function(req, res, next) {
  res.render('list_book', {title: 'Book List'});
});

router.get('/book/add', function(req, res, next) {
  res.render('create_book', {title: 'Create book'});
});

router.get('/book/delete', function(req, res, next)  {
  res.render('delete_book', {title: 'Delete Book'});
});

router.get('/book/update', function(req, res, next)  {
  res.render('update_book', {title: 'Update Book'});
});


/* Authors page Routes*/
router.get('/authors', authorController.author_list);

router.get('author/:id', authorController.author_detail);

router.get('/author/add', authorController.author_create_get);

router.post('/author/add', authorController.author_create_post);

router.get('/author/:id/delete', authorController.author_delete_get);

router.post('/author/:id/delete', authorController.author_delete_post);

router.get('/author/:id/update', authorController.author_update_get);

router.post('/author/:id/update', authorController.author_update_post);

/* Genres page Routes*/
router.get('/genres', function(req, res, next) {
  res.render('list_genre', {title: 'Genre List'});
});

router.get('/genre/add', function(req, res, next) {
  res.render('create_genre', {title: 'create genre'});
});

router.get('/genre/delete', function(req, res, next) {
  res.render('delete_genre', {title: 'Delete Genre'});
});

router.get('/genre/update', function(req, res, next) {
  res.render('update_genre', {title: 'Update Genre'});
});

/* Book Instance page Routes*/
router.get('/bookinstance', function(req, res, next) {
  res.render('list_bookinstance', {title: 'Book Instance List'});
});

router.get('/bookinstance/add', function(req, res, next) {
  res.render('create_bookinstance', {title: 'Create Book Instance'});
});

router.get('bookinstance/delete', function(req, res, next) {
  res.render('delete_bookinstance', {title: 'Delete Book Instance'});
});

router.get('bookinstance/update', function(req, res, next) {
  res.render('update_bookinstance', {title: 'Update Book Instance'});
});


module.exports = router;
