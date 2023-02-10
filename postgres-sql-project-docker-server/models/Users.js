import sequelize from "../db.js";
import DataTypes from "sequelize";
//вытаскиваем модель постов из базы данных postgress 
import Posts from './Posts.js';
//вытаскиваем модель лайков из базы данных postgress
import Likes from './Likes.js';

//составляем модель пользователя и фиксируем ее в базе данных postgress
const Users = sequelize.define("users", {
    //имя пользователя
    username: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    //пароль пользователя
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    }
})

//модель пользователя связываем с постами (в модели поста существует идентификатор пользователя)
Users.hasMany(Posts);
Posts.belongsTo(Users);

//модель пользователя связываем с лайками (в модели лайка существует идентификатор пользователя)
Users.hasMany(Likes);
Likes.belongsTo(Users);

//экспортируем модель пользователя
export default Users;