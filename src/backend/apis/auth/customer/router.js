var router = require('express').Router();
var customer = require('./customer');

router.use(isCustomer);

router.put('/book', customer.transactBooks);
router.get('/trans', customer.getTransactions);


module.exports = router;