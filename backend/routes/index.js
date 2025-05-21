const express = require('express');
const router = express.Router();

router.use('/payment/vnpay', require('./payment/vnpay'));

router.use('/user/auth', require('./user/auth')); 
router.use('/user/bookmark', require('./user/bookmark')); 
router.use('/user/purchase', require('./user/purchase'));
router.use('/user/program', require('./user/program'));


router.use('/admin/auth', require('./admin/auth')); 
router.use('/admin/article', require('./admin/article')); 
router.use('/admin/exercise', require('./admin/exercise')); 
router.use('/admin/program', require('./admin/program')); 
router.use('/admin/usermgmt', require('./admin/usermgmt')); 


router.use('/shared/article', require('./shared/article')); 
router.use('/shared/exercise', require('./shared/exercise')); 
router.use('/shared/program', require('./shared/program')); 

module.exports = router;
