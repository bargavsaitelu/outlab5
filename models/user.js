
const pool= require('../utils/database');


module.exports = class User{

    static get_credits(){
        return pool.query('SELECT u.credit FROM users u where u.user_id = 1');
    }

};