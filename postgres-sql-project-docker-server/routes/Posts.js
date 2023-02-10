import express from "express";
const router = express.Router();
//вытаскиваем модель базы данных по данным поста
import Posts from '../models/Posts.js';
//вытаскиваем модель базы данных по данным лайка
import Likes from '../models/Likes.js';

//вытаскиваем функцию определения данных по авторизованному пользователю
import validateToken from "../middlewares/AuthMiddleware.js";

//маршрутизатор запроса на получение всех постов и лайков авторизованного пользователя
router.get("/", validateToken, async (req, res) => {
    //получаем список всех постов
    const listOfPosts = await Posts.findAll({include: [Likes]});
    //получаем требуемый список лайков с идентификатором авторизованного пользователя req.user.id
    const likedPosts = await Likes.findAll({where: {userId: req.user.id}});
    //отправляем результат на клиент-приложение проекта
    res.json({listOfPosts: listOfPosts, likedPosts: likedPosts});
});

//маршрутизатор запроса на скачивание с сервера информации о посте с идентификатором id
router.get('/byId/:id', async (req, res) => {
    //вытаскиваем идентификатор поста
    const id = req.params.id;
    //определяем информацию о посте с идентификатором Id из всей базы данных Post
    const post = await Posts.findByPk(id);
    //отправляем на клиент приложение полученную информацию о посте с идентификатором id
    res.json(post);
})

//маршрутизатор запроса на получение постов пользователя с заданным идентификатором
router.get('/byuserId/:id', async (req, res) => {
    //определяем идентификатор пользователя посты которого будем вытаскивать из базы данных Posts
    const id = req.params.id;
    //вытаскиваем все посты пользователя с идентификатором id из базы данных Posts
    const listOfPosts = await Posts.findAll({
        where: {userId: id},
        include: [Likes]
    });
    //отправляем все найденные посты на клиент-приложение
    res.json(listOfPosts);
})

//маршрутизатор запроса на создание нового поста авторизованным пользователем
router.post("/", validateToken, async (req, res) => {
    //вытаскиваем название и содержание поста
    const {title, postText} = req.body;
    //вытаскиваем имя пользователя
    const username = req.user.username;
    //вытаскиваем идентификатор пользователя
    const userId = req.user.id;
    //создаем модель нового поста в базе данных postgress Sql
    const post = await Posts.create({title, postText, username, userId});
    //отправляем результат на клиент приложение проекта
    return res.json(post)
})

//маршрутизатор запроса на сервер на изменение названия поста 
router.put("/title", validateToken, async (req, res) => {
    //вытаскиваем название поста которое будем менять и сам идентификатор поста id
    const {newTitle, id} = req.body;
    //меняем название поста с определенным идентификатором id
    await Posts.update({title: newTitle}, {where: {id: id}});
    //само новое название поста отправляем на клиент-приложение проекта
    return res.json(newTitle);
})

//маршрутизатор запроса на сервер на изменение содержания поста 
router.put("/postText", validateToken, async (req, res) => {
    //вытаскиваем содержание поста которое будем менять и сам идентификатор поста id
    const {newText, id} = req.body;
    //меняем содержание поста с определенным идентификатором id
    await Posts.update({postText: newText}, {where: {id: id}});
    //само новое содержание поста отправляем на клиент-приложение проекта
    return res.json(newText);
})

//маршрутизатор запроса на сервер на удаление поста из базы данных Posts
router.delete("/:id", validateToken, async (req, res) => {
    //вытаскиваем идентификатор удаляемого поста
    const postId = req.params.id;
    //из базы данных по постам Posts удаляем указанный пост
    await Posts.destroy({
        where: {
            id: postId
        }
    })
    //удаление успешно совершено
    res.json("DELETED SECCESSFULLY");
})

export default router;