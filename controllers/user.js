const Prod = require('../models/prod');
const Cart = require('../models/cart');
const Orders = require('../models/orders');
const User = require('../models/user');


var prod_list = [];
var cart_list = [];
var order_list = [];

// to render products in url /prods 
exports.get_products = (req,res,next) => {
    var prod_list_obj = Prod.get_all();
    prod_list_obj.then(function(result){
        prod_list = result.rows;
        res.render('user/prods', {
            pageTitle: 'Products',
            path: 'prods',
            editing: false,
            data: prod_list
        });
    })

};


// GET action to render cart in url /cart
exports.get_cart = (req,res,next) => {
    var cart_list_obj = Cart.get_all();
    cart_list_obj.then(function(result){
        cart_list = result.rows;
        var credit_obj = User.get_credits();
        credit_obj.then(function(resi){
            res.render('user/cart', {
                pageTitle: 'Cart',
                path: 'cart',
                editing: false,
                data: cart_list,
                credit: resi.rows[0].credit
            });
        })
        // console.log(cart_list);
        
    })

};

// GET action to render orders in url /orders
exports.get_orders = (req,res,next) => {

    var orders_list_obj = Orders.get_all();
    orders_list_obj.then(function(result){
        order_list = result.rows;
        res.render('user/orders', {
            pageTitle: 'Orders',
            path: 'orders',
            editing: false,
            data: order_list
        });
    })


};

// POST action after clicking add to cart button
exports.add_to_cart = (req,res,next) => {
    const prod_id = req.body.product_id;
    // Refresh after redirect need to be implemented
    Prod
        .add_to_cart(prod_id)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

//POST action after clicking buy in cart
exports.buy = (req, res, next) => {

    var user_credits_obj = User.get_credits();
    user_credits_obj.then(function(result){
        user_credits = result.rows[0].credit;
        Cart 
            .buy(user_credits)
            .then(() => {
                res.redirect('/orders');
            })
            .catch(err => console.log(err));
    })
};