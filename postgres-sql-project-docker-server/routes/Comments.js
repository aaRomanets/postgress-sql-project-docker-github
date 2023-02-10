import express from "express";
const router = express.Router();
//вытаскиваем модель базы данных по комментариям
import Comments from "../models/Comments.js";
//вытаскиваем функцию определения данных по авторизованному пользователю
import validateToken from "../middlewares/AuthMiddleware.js";

//маршрутизатор запроса на скачивание с сервера комментариев к посту с идентификатором postId 
router.get('/:id', async (req, res) => {
    //определяем идентификатор поста по которому будем скачивать комментарии
    const postId = req.params.id;
    //определяем комментарии по посту с идентификатором postId в базе данных комментариев Comments
    const comments = await Comments.findAll({ where: { postId: postId } });
    //отправляем определенные комментарии на клиент-приложение проекта
    res.json(comments);
})

//маршрутизатор запроса на сервер на добавление нового комментария в базу данных комментариев Comments
router.post("/", validateToken, async(req, res) => {
    //содержание нового комментария
    const newComment = req.body;  
    //имя пользователя, который создает новый комментарий
    const username = req.user.username;
    newComment.username = username;
    //создаем указанный комментарий в базе данных комментариев
    await Comments.create(newComment);
    //вытаскиваем созданный комментарий из базы данных комментариев
    const comment = await Comments.findOne({ where: { commentBody: newComment.commentBody } });
    //отправляем созданный комментарий на клиент-приложение проекта
    res.json(comment);
})

//маршрутизатор запроса на сервер по удалению комментария
router.delete("/:id", validateToken, async (req, res) => {
    //определяем идентификатор удаляемого комментария 
    const commentId = req.params.id;
    //удаляем соответствующий комментарий из базы данных комментариев
    await Comments.destroy({
        where: {
            id: commentId
        }
    })
    //фиксируем сообщение о том, что требуемое удаление успешно завершено
    res.json("DELETED SUCCESSFULLY");
})

export default router;