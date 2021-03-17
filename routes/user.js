const path = require('path');
const express = require('express');

const userCon = require('../controllers/user');

const router = express.Router();


router.get('/prods',userCon.get_products);
router.get('/cart',userCon.get_cart);
router.get('/orders',userCon.get_orders);
router.post('/prods',userCon.add_to_cart);
router.post('/cart',userCon.buy);

module.exports = router;
