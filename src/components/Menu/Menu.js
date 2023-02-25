import { IonAvatar, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonLoading, IonMenu, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { clipboardOutline, logOutOutline, personCircleOutline } from "ionicons/icons";
import avatar from "../../pages/assets/images/avatar.png"
import axios from "../../config/axios";
//جلب المعلومات
import { Profile_URL } from "../../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Storage } from "@capacitor/storage";
import { useHistory } from "react-router";

const Menu = () => {

    const [showLoading,setShowLoading] = useState(false)
    const [name,setName] = useState()
    const [profileImg,setProfileImg] = useState()

    const {jwt,setLoggedIn} = useContext(AuthContext);

    const history = useHistory()

    useEffect(() => {
        getProfile()
    },[])

    const logOut = async () => {
        await Storage.remove({key:"accessToken"})
        setLoggedIn(false)
        history.push("/account/login")
    }

    const getProfile = async () => {
        setShowLoading(true)

        try{
            await axios.get(Profile_URL,{
                headers:{
                    Authorization:jwt
                }
            }).then(res => {
                console.log(res)
                setName(res.data.name)
                setProfileImg(res.data.img_uri)
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e.response)
            setShowLoading(false)
        }
        
    }



    return(
        <IonMenu side="end" contentId="menu">
            {showLoading ? 
            <IonLoading isOpen={showLoading}
             />
             :
             <>
              <IonHeader>
                <IonToolbar>
                <IonTitle>قائمة</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonAvatar className="avatar">
                    {profileImg ?
                    <IonImg src={profileImg} />
                    :
                    <IonImg src={avatar} />
                    }
                </IonAvatar>
                <div className="ion-text-center ion-margin-top">
                    <IonText color="danger">
                        <h3>{name}</h3>
                    </IonText>
                </div>
                <IonList>
                    <IonItem routerLink="/my-recipe/account/profile">
                        <IonIcon color="primary" icon={personCircleOutline} />
                        <IonLabel className="ion-margin">الصفحة الشخصية</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/my-recipe/my-posts">
                        <IonIcon color="primary" icon={clipboardOutline} />
                        <IonLabel className="ion-margin">منشوراتي</IonLabel>
                    </IonItem>
                    <IonItem onClick={() => {logOut()}}>
                        <IonIcon color="primary" icon={logOutOutline} />
                        <IonLabel className="ion-margin">تسجيل الخروج</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
             </>
             }
           
            
        </IonMenu>
    )
}

export default Menu;