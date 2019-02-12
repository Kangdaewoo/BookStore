var router = require('express').Router();
var admin = require('./admin');


router.use(isAdmin);

router.get('/user', admin.getUsers);
router.get('/user/:userId', admin.getUser);
router.get('/user/:userId/trans', admin.getTransactionsForUser);
router.get('/user/:userId/books', admin.getBooksForUser);

router.post('/book', admin.buyBooks);
router.put('/book', admin.updateBook);


module.exports = router;