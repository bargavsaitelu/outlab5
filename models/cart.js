
const pool= require('../utils/database');


module.exports = class Cart{

    constructor( user_id, item_id, quantity){
        this.user_id = user_id;
        this.item_id = item_id;
        this.quantity = quantity;
    }

    static get_all(){
        // return pool.query('SELECT * FROM cart;');
        return pool.query('SELECT p.title, p.image, p.price, c.quantity as quant FROM cart c, products p where p.id = c.item_id;');
    }

    // static get_credits(){
    //     return pool.query('SELECT u.credit FROM users u, cart c where u.user_id = c.user_id');
    // }

    static buy(credits){
        var total_amount_obj = pool.query('SELECT sum(c.quantity*p.price) as total_amount FROM cart c, products p WHERE c.item_id = p.id GROUP BY c.user_id');
        total_amount_obj.then(function(res){
            if(res.rows[0]==null){
                console.log("No items in cart");
            }
            else{
                var total_amount = res.rows[0].total_amount;
                if(total_amount > credits){
                    console.log("Credit limit exceeded");
                }
                else{
                    // console.log(total_amount);
                    pool.query('UPDATE users SET credit = $1;',[credits-total_amount]);
                    var cart_items_obj = pool.query('SELECT * from cart;');
                    cart_items_obj.then(function(result){
                        var cart_items = result.rows;
                        for(var i=0;i<cart_items.length;i++){
                            var user_id = cart_items[i].user_id;
                            var item_id = cart_items[i].item_id;
                            var quantity = cart_items[i].quantity;
                            var order_obj = pool.query('SELECT * FROM orders where user_id = $1 AND item_id = $2;',[user_id, item_id]);
                            order_obj.then(function(resi){
                                var existed_order = resi.rows[0];
                                if(existed_order == null){
                                    pool.query('INSERT into orders(user_id, item_id, quantity) VALUES($1, $2, $3);',[user_id, item_id, quantity]);
                                }
                                else{
                                    pool.query('UPDATE orders SET quantity = $1 where user_id = $2 and item_id = $3;',[quantity + existed_order.quantity, user_id, item_id]);
                                    // pool.query('INSERT into orders(user_id, item_id, quantity) VALUES($1, $2, $3);',[user_id, item_id, quantity + existed_order.quantity]);
                                }
                            })
                            
                        } 
                        pool.query('DELETE FROM cart;');
                    })
                }
            }
            
        })
        total_amount_obj.catch(err => console.log(err));
        return pool.query('SELECT * FROM orders;')
    }
    

};