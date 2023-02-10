import express from "express";
import cors from "cors";

//определяем базу данных tutorialDb в postgres_Sql
import sequelize from "./db.js";

const app = express();
//ответ с роутеров будет приходить в формате json
app.use(express.json());
//включаем возможность перехода с одного локального адреса на другой
app.use(cors());

//задаем порт сервера
const PORT = process.env.PORT || 3018;

//маршрутизаторы
import postRouter from './routes/Posts.js';
//подключаем маршрутизаторы запросов по постам
app.use("/posts", postRouter);

import commentsRouter from "./routes/Comments.js";
//подключаем маршрутизаторы запросов по комментариям
app.use("/comments", commentsRouter);

import usersRouter from "./routes/Users.js";
//подключаем маршрутизаторы запросов по пользователям
app.use("/auth", usersRouter);

import likesRouter from "./routes/Likes.js";
//подключаем маршрутизаторы запросов по лайкам
app.use("/likes", likesRouter);

const start = async () => {
    try {
        //подключаемся к базе данных tutorialDb в postgres_Sql
        await sequelize.authenticate();
        await sequelize.sync();
        
        //запускаем сервер
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
} 

start();