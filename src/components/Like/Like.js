import { IonButtons, IonCol, IonIcon } from "@ionic/react"
import axios from "../../config/axios"
import {heartOutline,heart} from "ionicons/icons"
import { GET_ALL_POSTS } from "../../config/urls"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"


const Like = (props) => {

    const [likeCount,setLikeCount] = useState()

    const [userLiked,setUserLiked] = useState()

    const [refeshLike,setRefeshLike] = useState()

    const {jwt} = useContext(AuthContext)

    const postId = window.location.pathname.split("/")[3]

    useEffect(() => {
        getLikes()
        sendLikeCount()
    }, [likeCount,refeshLike])
    
    const getLikes = async() => {
        try{
            await axios.get(GET_ALL_POSTS + "/" + postId + "/like-count",{
                headers:{
                    Authorization:jwt
                }
            }).then(res => {
                console.log(res);
                //عدد الاعجاياب
                setLikeCount(res.data.likes)
                //المتسخدمين المعجبين
                setUserLiked(res.data.userLiked)
            })
        } catch(e) {
            console.log(e.response);
        }
    }

    const like = async () => {

        try{
            await axios.put(GET_ALL_POSTS + "/" + postId + "/like",{},{
                headers:{
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                setRefeshLike(res.data)
            })
        } catch(e) {
            console.log(e.response);
        }
    }

    //ارسال عدد الاعجابات
    const sendLikeCount = () => {
        //ارسال الى المكون الاب get Like
        props.sendToParent(likeCount)

    }

    return(
        <IonCol size="2">
        <IonButtons onClick={() => {
            like();
        }}>
            {userLiked 
            ?
            <IonIcon icon={heart} color="danger" className="post-icon" />
            :
            <IonIcon icon={heartOutline} color="primary" className="post-icon" />
            }

         </IonButtons>
         </IonCol>
    )
}

export default Like;