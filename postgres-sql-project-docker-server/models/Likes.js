import sequelize  from "../db.js";

//составляем модель лайков в базе данных MongoDb
const Likes = sequelize.define("likes")

//экспортируем модель лайков
export default Likes;