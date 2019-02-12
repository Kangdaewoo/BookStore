var router = require('express').Router();
var book = require('./book');


router.get('/', book.getBook);
router.get('/:bookId', book.getBooks);


module.exports = router;