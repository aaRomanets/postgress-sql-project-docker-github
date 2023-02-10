import express from "express";
const router = express.Router();
//вытаскиваем модель базы данных по данным пользователя
import Users from "../models/Users.js";
import bcrypt from "bcrypt";
//вытаскиваем функцию определения данных по авторизованному пользователю
import validateToken from "../middlewares/AuthMiddleware.js"; 
import jwt from "jsonwebtoken";

//маршрутизатор запроса по регистрации пользователя
router.post("/", async (req, res) => {
    //определяем данные регистрируемого пользователя
    const {username, password} = req.body;
    //шифруем пароль регистрируемого пользователя
    bcrypt.hash(password, 10).then((hash) => {
        //составляем модель базы данных регистрируемого пользователя в базе данных Postgress sql
        Users.create({
            username: username,
            password: hash
        })
        //пользователь успешно зарегистрирован
        res.json("SUCCESS");
    })
})

//маршрутизатор запроса по авторизации зарегистрированного пользователя
router.post("/login", async (req, res) => {
    //определяем данные авторизируемого пользователя
    const {username, password} = req.body;

    //ищем пользователя с именем username по всей базе данных пользователей
    const user = await Users.findOne({where : {username: username}});

    //если пользователя нет, то выводим сообщение что требуемый пользователь не найден
    if (!user) res.json({error: "User Doesn't Exist"});

    //сравниваем пароль password с паролем определенного пользователя user
    bcrypt.compare(password, user.password).then((match) => {
        if (!match) res.json({error: "Wrong Username And Password Combination"});

        //составляем токен авторизируемого пользователя по его имени user.username и идентификатору user.id
        const accessToken = jwt.sign(
            {username: user.username, id: user.id}, 
            "importantsecret"
        );
        //авторизация пользователя осуществилась
        //отправляем на клиент-приложение все данные об авторизированном пользователе
        res.json({token: accessToken, username: username, id: user.id});
    })
})

//маршрутизатор запроса на проверку существования авторизированного пользователя
router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
})

//маршрутизатор запроса на получение основной информации по пользователю с заданным идентификатором
router.get("/basicInfo/:id", async (req, res) => {
    //определяем идентификатор интересуемого пользователя
    const id = req.params.id;

    //находим в моделе базы данных по пользователям информацию о пользователе с идентификатором id за исключением его пароля
    const basicInfo = await Users.findByPk(id, {
        attributes: {exclude: ["password"]}
    })

    //отправляем найденную информацию на клиент-приложение
    res.json(basicInfo);
})

//маршрутизатор по запросу на изменение пароля по авторизируемому пользователю
router.put('/changepassword', validateToken, async (req, res) => {
    //вытаскиваем старый и новый пароль
    const {oldPassword, newPassword} = req.body;
    //во всей моделе базы данных по пользователям находим данные по пользователю с именем req.user.username и паролем oldPassword
    const user = await Users.findOne({where: {username: req.user.username}});

    //сравниваем новый пароль со старым
    bcrypt.compare(oldPassword, user.password).then( async (match) => {
        if (!match) res.json({error: "Wrong Password Entered!"});

        //шифруем новый пароль
        bcrypt.hash(newPassword, 10).then(async (hash) => {
            //в модели базы данных пользователя с именем req.user.username 
            //старый зашифрованный пароль меняем на новый зашифрованный пароль
            await Users.update({password: hash}, {where: {username: req.user.username}})
            res.json("SUCCESS");
        })
    })
})

export default router;