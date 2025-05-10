const express = require('express');
const router = express.Router();

//Route cho user
router.use('/user/auth', require('./user/auth')); 
router.use('/user/bookmark', require('./user/bookmark')); 

//Route cho admin
router.use('/admin/auth', require('./admin/auth')); 
router.use('/admin/article', require('./admin/article')); 
router.use('/admin/exercise', require('./admin/exercise')); 

//Route dùng chung
router.use('/shared/article', require('./shared/article')); 
router.use('/shared/exercise', require('./shared/exercise')); 

module.exports = router;
