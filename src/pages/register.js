import { IonAlert, IonAvatar, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonRouterLink, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react"
import Header from "../components/Header/Header";
import avatar from "../pages/assets/avatar.png";
import styles from "./assets/styles/register.css"
import {Formik} from "formik";
import * as yup from "yup";
import axios from "../config/axios"
import { REGISTER_URL } from "../config/urls";
import { useState } from "react";
import { useHistory } from "react-router";


const Register = () => {

    const [showLoading,setShowLoading] = useState(false);
    const [showAlert,setShowAlert] = useState(false);
    const [showAlertError,setShowAlertError] = useState(false)

    const history = useHistory()
    
    const validationSchema = yup.object({
        name:yup
        .string()
        .nullable()
        .required("اسم المستخدم مطلوب"),

        email:yup
        .string()
        .nullable()
        .email("يجب ادخال البريد الالكتروني الصحيح")
        .required("البريد الالكتروني مطلوب"),

        password:yup
        .string()
        .nullable()
        .min(5,"less 5 letter")
        .required("يجب ادخال كلمة المرور")
    }) 

    const onSubmit = async (values) => {
        setShowLoading(true)
        try{
        await axios.post(REGISTER_URL,values).then(res => {
            console.log(res)
            setShowAlert(true)
            setShowLoading(false)
        
        })
        } catch(e){
            if(e.response.status == 400) {
                setShowLoading(false)
                setShowAlertError(true)
            } else{
            console.log(e.message)
            setShowLoading(false)
        }
    }
} 


    return(
        <IonPage>
            {showLoading
             ? 
             <IonLoading 
             isOpen={showLoading}
             duration={2000}
             /> 
            :
            <>
            <IonAlert
            isOpen={showAlert}
            header="تنبيه"
            subHeader="لقد تم تسجيل حسابك"
            message="يمكنك الانتقال الى صفحة تسجيل الدخول"
            buttons={[
                {
                    text:"موافق",
                    handler:() => {
                        history.push("/account/login")
                    }
                }
            ]}
            />
            <IonAlert
            isOpen={showAlertError}
            duration={30}
            header="تنبيه"
            subHeader="حسابك مسجل بالفعل"
            message="يمكنك الانتقال الى صفحة تسجيل الدخول"
            buttons={[
                {
                    text:"موافق",
                    handler:() => {
                        history.push("/account/login")
                    }
                
                },
                {
                    text:"الغاء",
                    role:"cancel"
                }
            ]}
            />
            <Header headerTitle= "صفحة تسجيل الدخول" />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" offsetMd="3" sizeLg="4" offsetLg="4">
                        <IonAvatar className="avatar">
            <IonImg src={avatar} />
            </IonAvatar>

<Formik initialValues={{
        name:null,
        email:null,
        password:null
    }}
    validationSchema={validationSchema}
    onSubmit={(values,{resetForm}) => {
        onSubmit(values);
        resetForm({values:""})
    }}
    >
        {
        formikProps =>(
        <form onSubmit={formikProps.handleSubmit}>
            <IonItem>
                <IonLabel color="warning" position="floating">الاسم</IonLabel>
                <IonInput 
                name="name"
                value={formikProps.values.name}
                onIonChange={formikProps.handleChange}
                />
                </IonItem>
                <IonText className="error">{formikProps.touched.name && formikProps.errors.name}</IonText>
                <IonItem>
                <IonLabel color="warning" position="floating">البريد الالكتروني</IonLabel>
                <IonInput 
                name="email"
                value={formikProps.values.email}
                onIonChange={formikProps.handleChange}
                />
                    </IonItem>
                <IonText className="error">{formikProps.touched.email && formikProps.errors.email}</IonText>
                    <IonItem>
                <IonLabel color="warning" position="floating">كلمة المرور</IonLabel>
                <IonInput 
                name="password"
                type="password"
                value={formikProps.values.password}
                onIonChange={formikProps.handleChange}
                />
            </IonItem>
            <IonText className="error">{formikProps.touched.password && formikProps.errors.password}</IonText>
            <div className="btn ion-text-center">
                <IonButton type="submit">انشاء حساب</IonButton>
                <IonRouterLink routerLink="/account/login" className="router-link" color="warning">تسجل الدخول</IonRouterLink>
            </div>
                </form>
                )
                }
                </Formik>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            
            </IonContent>
            </>
            }
            
        </IonPage>
    )
} 

export default Register;