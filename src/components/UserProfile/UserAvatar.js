import { IonAvatar, IonIcon, IonImg } from "@ionic/react"
import { addOutline } from "ionicons/icons"
import { useContext, useEffect, useRef, useState } from "react"
import avatar from "../../pages/assets/images/avatar.png"
import { usePhotoGallery } from "../../hooks/usePhotoGallery"
import axios from "../../config/axios"
import { UPLOAD_USER_PHOTO } from "../../config/urls"
import { AuthContext } from "../../context/AuthContext"


const UserAvatar = (props) => {

    const [userImg,setUserImg] = useState(props.userImg)
    //show picture
    const {jwt} = useContext(AuthContext)

    const takePhotoRef = useRef()

    const {takePhoto,blobUrl} = usePhotoGallery()

    useEffect(() => {
        if(blobUrl){
        setUserImg(blobUrl)
        uploadPoto()
        }
    },[blobUrl])

    const uploadPoto = async() => {
        const photoData = new FormData();

        try{
            const response = await fetch(blobUrl)
            //الحصول على الملف
            const blob = await response.blob();

            photoData.append("avatar",blob)
            await axios.put(UPLOAD_USER_PHOTO,photoData,{
                headers:{
                    Authorization:jwt
                }
            }).then(res => {
                console.log(res)
            })
        } catch(e){
            console.log(e.response)
        }
    }

    return(
        <div className="avatar-container">
                <IonAvatar className="avatar" ref={takePhotoRef} onClick={() => {takePhoto()}}>
                    {userImg 
                    ?
                    <IonImg src={userImg} />
                    :
                    <IonImg src={avatar} />
                    }
                </IonAvatar>
                <IonIcon icon={addOutline} onClick={() => {takePhotoRef.current.click()}} color="light" className="user-icon" />
                </div>
    )
}

export default UserAvatar;