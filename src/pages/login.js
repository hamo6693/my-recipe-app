import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRouterLink, IonRow } from "@ionic/react"
import Header from "../components/Header/Header";
import { logIn } from "ionicons/icons";
import styles from "./assets/styles/login.css"
import { useContext, useState } from "react";
import { LOGIN_URL } from "../config/urls";
import axios from "../config/axios";
import { Storage } from '@capacitor/storage';
import { useHistory } from "react-router";

import { AuthContext } from "../context/AuthContext";


const Login = () => {

    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [showLoading,setShowLoading] = useState(false);
    const [showAlert,setShowAlert] = useState(false);

    const {setLoggedIn,setJwt} = useContext(AuthContext)

    const history = useHistory();



    const onSubmit = async () => {
        setShowLoading(true)
        const logInForm = {
            email,
            password
        }
        try{
            await axios.post(LOGIN_URL,logInForm).then(res => {
                 Storage.set({
                    key: 'accessToken',
                    value: res.data.accessToken
                  });
                  //in case login
                  setLoggedIn(true);
                  setJwt(res.data.accessToken)
                  history.push("/my-recipe/all-posts")
                  setShowLoading(false);
            })
        }catch(e){
            if(e.response.status === 401) {
                setShowAlert(true);
                setShowLoading(false)
            } else{
                console.log(e.response)
                setShowLoading(false)
            }
            
        }
    }
    return(
        <IonPage>
            {showLoading 
            ?
            <IonLoading isOpen={showLoading} duration={10000} />
            :
            <>
            <IonAlert 
            isOpen={showAlert}
            onDidDismiss={() =>{setShowAlert(false)}}
            header="تنبيه"
            message="الرجاء التاكد من المعلومات المدخله"
            buttons={[
                {
                    text:"موافق",
                    rule:"ok"
                }
            ]}
            />
            <Header headerTitle="صفحة تسجيل الدخول"/>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" offsetMd="3" sizeLg="4" offsetLg="4">
                        <IonList>
                    <IonItem className="ion-margin-bottom">
                        <IonIcon icon={logIn} className="icon" />
                        <IonLabel position="floating" color="warning" >البريد الالكتروني</IonLabel>
                        <IonInput value={email} onIonChange={(e) =>{setEmail(e.target.value)}}/>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating" color="warning">كلمة المرور</IonLabel>
                        <IonInput type="password" value={password} onIonChange={(e) =>{setPassword(e.target.value)}} />
                    </IonItem>

                </IonList>
                <div className="btn ion-text-center">
                <IonButton onClick={() => {onSubmit() }}>تسجيل الدخول </IonButton>
                <IonRouterLink routerLink="/account/register" className="router-link" color="warning">تسجل مستخدم</IonRouterLink>
                </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            </>
            }
            
        </IonPage>
    )
} 

export default Login;