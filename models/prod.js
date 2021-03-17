const pool= require('../utils/database');
module.exports = class Prod{

    constructor( title, image, price, quantity){
        this.title = title;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }

    add_prod(){
        return pool.query('INSERT INTO products(title, price, image, quantity) VALUES ($1, $2, $3, $4);', [this.title, this.price, this.image, this.quantity]);
    }

    static get_all(){
        return pool.query('SELECT * FROM products');

    }

    static get_prod(prod_id){
        return pool.query('SELECT * FROM products where id = $1',[prod_id]);
    }

    static add_to_cart(prod_id){
        var prod_quantity_obj = pool.query('SELECT quantity FROM products WHERE id = $1;',[prod_id]);
        var product_quantity;
        prod_quantity_obj.then(function(result){
            product_quantity = result.rows[0].quantity;
            var cart_quantity;
            if(product_quantity != 0){
                var cart_quantity_obj = pool.query('SELECT quantity FROM cart WHERE item_id = $1;',[prod_id]);

                cart_quantity_obj.then(function(res){
                    cart_quantity = res.rows[0];
                    if(cart_quantity == null){
                        pool.query('INSERT INTO cart(user_id, item_id, quantity) VALUES ($1, $2, $3);',[1,prod_id,1]);
                        pool.query('UPDATE products SET quantity = $1 WHERE id = $2;',[product_quantity-1,prod_id]);
                    }
                    else{
                        cart_quantity = cart_quantity.quantity + 1;
                        console.log(cart_quantity);
                        pool.query('UPDATE products SET quantity = $1 WHERE id = $2;',[product_quantity-1,prod_id]);
                        pool.query('UPDATE cart SET quantity = $1 where item_id = $2;',[cart_quantity,prod_id]);
                    } 
                });
            }
        })
        return pool.query('SELECT * FROM cart;');
        
    }

};