const express = require('express');
const router = express.Router();


const {createCoupon,getCoupon,getCouponById,updateCoupon,deleteCoupon,verifyCoupon}= require('../controller/couponController');

router.post('/createCoupon',createCoupon);
router.get('/getCoupon',getCoupon);
router.get('/getCouponById/:id',getCouponById);
router.put('/updateCoupon/:id',updateCoupon);
router.delete('/deleteCoupon/:id',deleteCoupon);
router.post('/verifycoupon',verifyCoupon);

module.exports = router;