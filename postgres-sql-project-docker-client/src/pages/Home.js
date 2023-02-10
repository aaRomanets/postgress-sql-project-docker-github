//вытаскиваем хук useContext
import React, {useContext} from "react";
import axios from "axios";
//вытаскиваем хук useEffect и useState
import { useEffect, useState } from "react";
//вытаскиваем хук useHistory
import { Link, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
//вытаскиваем контекст в который обернуто состояние авторизованного пользователя
import {AuthContext} from "../helpers/AuthContext";

//основная страница проекта
function Home() {
    //состояние списка постов по всем пользователям
    const [listOfPosts, setListOfPosts] = useState([]);
    //состояние списка постов связанных с лайками по авторизованному пользователю
    const [likedPosts, setLikedPosts] = useState([]);
    //состояние авторизованного пользователя, полученное из контекста
    const {authState} = useContext(AuthContext);

    //определяем компонент перехода по сайтам из хука useHistory
    let navigate = useNavigate();

    useEffect(() => 
    {
        //если в localStorage нет информации об авторизованном пользователе
        if (!localStorage.getItem("accessToken")) 
        {
            //переходим на страницу авторизации пользователя
            navigate("/login");
        } 
        else 
        {
            //делаем запрос на получение всех постов и лайков авторизованного пользователя
            axios.get("http://localhost:4018/posts", 
            {
                //отправляем на сервер токен в котором содержится информация об авторизованном пользователе из localStorage
                headers: 
                { 
                    accessToken: localStorage.getItem("accessToken") 
                },
            })
            .then((response) => 
            {
                //получили список всех постов
                setListOfPosts(response.data.listOfPosts);
                //создаем список постов связанных с лайками по авторизованному пользователю
                setLikedPosts(
                    response.data.likedPosts.map((like) => 
                    {
                        return like.postId;
                    })
                );
            });
        }
    }, [navigate]);

    //функция изменения количества лайков по постам
    const likeAPost = (postId) => {
        //делаем запрос на изменение количества лайков в базе данных лайков на сервере
        axios.post("http://localhost:4018/likes",
            {
                //идентификатор поста лайк из которого будем создавать или удалять в базе данных лайков
                postId: postId 
            },
            {
                //отправляем на сервер токен в котором содержится информация об авторизованном пользователе из localStorage
                headers: 
                {
                    accessToken: localStorage.getItem("accessToken")
                }
            }
        ).then((response) => 
        {
            //в результате проведения указанного запроса перебираем все посты
            setListOfPosts(listOfPosts.map((post) => 
            {         
                //идентификатор перебираемого поста post.id совпал с идентификатором обрабатываемого поста postId 
                if (post.id === postId) 
                {   
                    if (response.data.liked) 
                    {
                        //лайк обрабатываемого поста определен и он добавлен в базу данных лайков
                        post = { ...post, likes: [...post.likes, 0] };
                        return post;
                    } 
                    else 
                    {
                        //лайк обрабатываемого поста удален из его соответствующего состояния и из базы данных лайков
                        const likesArray = post.likes;
                        likesArray.pop();
                        return { ...post, likes: likesArray };
                    }
                } 
                else 
                {
                    //в противном случае обрабатываемый пост остается без изменений
                    return post;
                }
            }));

            if (likedPosts.includes(postId)) 
            {
                //если в списке постов связанных с лайками по авторизованному пользователю есть пост
                //с идентификатором postId то он удаляется из этого списка
                 setLikedPosts(
                    likedPosts.filter((id) => 
                    {
                        return id !== postId;
                    })
                );
            } 
            else 
            {
                //в противном случае в список постов связанных с лайками по авторизованному пользователю 
                //добавляем пост с идентификатором postId
                setLikedPosts([...likedPosts, postId]);
            }
        });
    };

    return (
        <div>
            {/*Показываем все посты на этой странице */}           
            { authState.status ? ( listOfPosts.map((value, key) => {
                return (
                    <div key={key} className="post">
                        {/*Название поста */}
                        <div className="title"> {value.title} </div>
                            <div className="body"
                                //Возможность перехода на страницу показа полной информации о посте включая его комментарии
                                onClick={() => {
                                    navigate(`/post/${value.id}`);
                                }}
                            >
                            {/*Содержание поста */}
                            {value.postText}
                        </div>
                        <div className="footer">
                            <div className="username">
                                {/*Ссылка на страницу показа профиля пользователя c идентификатором value.userId, который создал этот пост*/}
                                <Link to={`/profile/${value.userId}`}> {value.username} </Link>
                            </div>
                            <div className="buttons">
                                <ThumbUpAltIcon
                                    onClick={() => {
                                        //Функция добавления или удаления лайков этого поста на сервере в базе данных лайков
                                        likeAPost(value.id);
                                    }}
                                    className={
                                        //если в базе данных лайков есть лайк с идентификатором  поста value.id то активируем
                                        //кнопку удаления этого лайка в противном случае активируем кнопку добавления нового лайка
                                        likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                                    }
                                />
                                {/* Количество лайков отдельного поста*/}
                                <label> {value.likes.length}</label>
                            </div>
                        </div>
                    </div>
                );
                })) : 
                (
                    <>
                    </>
                )
            }
        </div>
    );
}

export default Home;