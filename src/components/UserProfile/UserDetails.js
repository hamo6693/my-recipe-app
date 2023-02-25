import {IonInput,IonItem,IonLabel,IonList,IonButton, IonToast} from "@ionic/react"
import { useState } from "react";

const UserDetails = (props) => {
    const [name,setName] = useState(props.name)
    const [password,setPassword] = useState()
    const [disabled,setDisabled] = useState(true)
    //عناصر الادخال
    const [showToast,setShowToast] = useState(false)
    const [showPassToast,setShowPassToast] = useState(false)
    
    const handleClick = () => {
        if(name && password) {
            if(password.length < 5) {
                setShowPassToast(true)
            } else{
                props.userName(name)
                props.password(password)
                props.showAlert(true)
            }
        } else {
            setShowToast(true)
        }
    }


    return(
        <IonList>
                    <IonItem>
                        <IonLabel color="warning" position="floating">الاسم</IonLabel>
                        <IonInput value={name} onIonChange={(e)=>{setName(e.target.value)}}/>
                    </IonItem>
                    <IonItem>
                        <IonLabel color="warning" position="floating">البريد الالكتروني</IonLabel>
                        <IonInput value={props.email} disabled/>
                    </IonItem>
                    <IonItem>
                        <IonLabel color="warning" position="floating">كلمة المرور</IonLabel>
                        <IonInput type="password" value={password} onIonChange={(e)=> {
                            setPassword(e.target.value)
                            setDisabled(false)
                        }} />
                    </IonItem>
                    <div className="btn">
                    <IonButton onClick={() => {handleClick()}} disabled={disabled} expand="block">تعديل البيانات</IonButton>
                    </div>
                    <IonToast 
                    isOpen={showToast}
                    onDidDismiss={() => {setShowToast(false)}}
                    message="يجب عليك ادخال جميع العناصر"
                    duration={1500}
                    color="danger"
                    />
                    <IonToast 
                    isOpen={showPassToast}
                    onDidDismiss={() => {setShowPassToast(false)}}
                    message="يجب عليك ادخال 5 محارف على الاقل"
                    duration={1500}
                    color="danger"
                    />
                </IonList>
    )
}

export default UserDetails;