var router = require('express').Router();
var authentication = require('./authentication');

var customerRouter = require('./customer/router');
var adminRouter = require('./admin/router');

router.use(authentication.identify);
router.get('/logout', authentication.logOut);

router.use('/customer', customerRouter);
router.use('/admin', adminRouter);


module.exports = router;