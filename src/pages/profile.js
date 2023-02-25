import { 
    IonAlert,
    IonCol,
    IonContent,
    IonGrid,
    IonLoading,
    IonPage, 
    IonRow
} from "@ionic/react";
import Header from "../components/Header/Header"
import "./assets/styles/profile.css"
import { useContext, useEffect, useState } from "react";
import axios from "../config/axios";
import { Profile_URL,Profile_Update_URL } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import UserDetails from "../components/UserProfile/UserDetails"
import UserAvatar from "../components/UserProfile/UserAvatar";




const Profile = () => {

    const [showLoading,setShowLoading] = useState(false)
    const [name,setName] = useState()
    const [email,setEmail] = useState()
    const [userImg,setUserImg] = useState()
    const [password,setPassword] = useState()
    const [showAlert,setShowAlert] = useState(false)



    //جلب رمز التحقق 
    const {jwt} = useContext(AuthContext)


    useEffect(() => {
        getProfile()
    },[])

    

    const getProfile = async () => {
        setShowLoading(true)
        try{
            //جلب العنوان والصفحة
            await axios.get(Profile_URL,{
                //send data
                headers:{
                    Authorization:jwt
                }
            }).then(res => {
                console.log(res.data);
                setName(res.data.name)
                setEmail(res.data.email)
                setUserImg(res.data.img_uri)
                setShowLoading(false)
            })
        } catch(e){
            console.log(e.response)
            setShowLoading(false)
        }
    }

    const onSumbit = async () => {
        setShowLoading(true)

        const updateForm = {
            'name':name,
            'password':password
        }
        try{
            await axios.put(Profile_Update_URL,updateForm,{
                headers:
                {
                    Authorization:jwt
                }
            }).then(res => {
                console.log(res)
                setShowLoading(false)
            })
        } catch(e){
            console.log(e.response)
            setShowLoading(false)
        }
    }


    return(
        <IonPage>
            {showLoading 
            ? 
            <IonLoading isOpen={showLoading} />
            :
            <>
            <IonAlert
            isOpen={showAlert}
            header="تنبيه"
            message="هل تريد تعديل البيانات؟"
            //onDidDismiss={()=> {setShowAlert(false)}}
            buttons={[
                {
                    text:"موافق",
                    handler:() => {onSumbit()}
                },
                {
                    text:"الغاء",
                    role:"cancel"
                }
            ]}
            />
            <Header headerTitle="صفحة شخصية"/>
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd="6" offsetMd="3" sizeLg="4" offsetLg="4">
                        <UserAvatar userImg={userImg} />
                        <UserDetails name={name} email={email} userName={setName} password={setPassword} showAlert={setShowAlert} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
              
            </IonContent>
            </>
            }
        </IonPage>
    )
} 

export default Profile;