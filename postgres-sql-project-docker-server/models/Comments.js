import sequelize from "../db.js";
import DataTypes from "sequelize";

//составляем модель комментариев в базе данных postgress
const Comments = sequelize.define("comments", {
    //содержание комментария
    commentBody: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    //имя пользователя, который создал комментарий
    username: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

//экспортируем модель комментариев
export default Comments;