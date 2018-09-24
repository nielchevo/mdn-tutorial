var express = require('express');
var router = express.Router();

/* Controllers */
var authorController = require('../controllers/authorController');
var bookController = require('../controllers/bookController');
var genreController = require('../controllers/genreController');
var bookInstanceController = require('../controllers/bookInstanceController');


/* GET home page. */
router.get('/', bookController.index); 

/* Books page Routes */
router.get('/books', bookController.book_list);

router.get('/book/add', bookController.book_create_get);
router.post('/book/add', bookController.book_create_post);

router.get('/book/:id/delete', bookController.book_delete_get)
router.post('/book/:id/delete', bookController.book_delete_post);

router.get('/book/:id/update', bookController.book_update_get);
router.post('/book/:id/update', bookController.book_update_post);

router.get('/book/:id', bookController.book_detail);


/* Authors page Routes*/
router.get('/authors', authorController.author_list);

router.get('/author/add', authorController.author_create_get);
router.post('/author/add', authorController.author_create_post);

router.get('/author/:id/delete', authorController.author_delete_get);
router.post('/author/:id/delete', authorController.author_delete_post);

router.get('/author/:id/update', authorController.author_update_get);
router.post('/author/:id/update', authorController.author_update_post);

router.get('/author/:id', authorController.author_detail);

/* Genres page Routes*/
router.get('/genres', genreController.genre_list);

router.get('/genre/add', genreController.genre_create_get);
router.get('/genre/add', genreController.genre_create_post);

router.get('/genre/:id/delete', genreController.genre_delete_get);
router.get('/genre/:id/delete', genreController.genre_delete_post);

router.get('/genre/:id/update', genreController.genre_update_get);
router.get('/genre/:id/update', genreController.genre_update_post);

router.get('/genre/:id/detail', genreController.genre_create_get);


/* Book Instance page Routes*/
router.get('/bookinstance', bookInstanceController.bookinstance_list);

router.get('/bookinstance/add', bookInstanceController.bookinstance_create_get);

router.get('/bookinstance/:id/delete', bookInstanceController.bookinstance_delete_get);

router.get('/bookinstance/:id/update/', bookInstanceController.bookinstance_update_get);

router.get('/bookinstance/:id', bookInstanceController.bookinstance_detail);

module.exports = router;
