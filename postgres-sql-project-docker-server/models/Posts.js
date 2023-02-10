import sequelize from '../db.js';
import DataTypes from "sequelize";
//вытаскиваем модель комментариев
import Comments  from "./Comments.js";
//вытаскиваем модель лайков
import Likes from "./Likes.js";

//составляем модель поста и фиксируем ее в базе данных postgress
const Posts = sequelize.define("posts", {
    //название поста
    title: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    //содержание поста
    postText: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    //имя пользователя, который создает пост
    username: {
        type: DataTypes.STRING, 
        allowNull: false
    }
})

//модель поста связываем с моделью комментариев (в модели комментариев существует идентификатор поста)
Posts.hasMany(Comments)
Comments.belongsTo(Posts)

//модель поста связываем с моделью лайков (в модели лайков существует идентификатор поста)
Posts.hasMany(Likes)
Likes.belongsTo(Posts)

//экспортируем модель лайков
export default Posts;