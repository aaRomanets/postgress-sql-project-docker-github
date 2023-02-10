import express from "express";
const router = express.Router();
//вытаскиваем модель базы данных по лайкам
import Likes from "../models/Likes.js";
//вытаскиваем функцию определения данных по авторизованному пользователю
import validateToken from "../middlewares/AuthMiddleware.js";

//маршрутизатор запроса на изменение количества лайков в базе данных лайков на сервере
router.post("/", validateToken, async (req, res) => {
    //вытаскиваем идентификатор поста
    const { postId } = req.body;
    //вытаскиваем идентификатор пользователя 
    const userId = req.user.id;
  
    //определяем существует ли в базе данных лайков лайк с идентификатором поста postId и идентификатором пользователя userId 
    const found = await Likes.findOne({
        where: { postId: postId, userId: userId },
    });

    if (!found) 
    {
        //указанный лайк не существует, тогда в базе данных лайков создаем новый лайк 
        //с идентификатором поста postId и идентификатором пользователя userId 
        await Likes.create({ postId: postId, userId: userId });
        //реузультат успешного создания соответствующего лайка отправляем на клиент приложение проекта
        res.json({ liked: true });
    } 
    else 
    {
        //указанный лайк существует, тогда в базе данных лайков удаляем этот лайк 
        //с идентификатором поста postId и идентификатором пользователя userId 
        await Likes.destroy({
            where: { postId: postId, userId: userId },
        });
        //реузультат успешного удаления соответствующего лайка отправляем на клиент приложение проекта
        res.json({ liked: false });
    }
})

export default router;