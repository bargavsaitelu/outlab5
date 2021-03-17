
const pool= require('../utils/database');

module.exports = class Orders{

    constructor( user_id, item_id, quantity){
        this.user_id = user_id;
        this.item_id = item_id;
        this.quantity = quantity;
    }

    static get_all(){
        return pool.query('SELECT p.title, p.image, p.price, o.quantity FROM orders o, products p where p.id = o.item_id;');
    }

    static add_order(){
        return pool.query('INSERT into orders(user_id, item_id, quantity) VALUES ($1,$2,$3);',[this.user_id, this.item_id, this.quantity]);
    }

};