import { IonInput, IonItem, IonLabel } from "@ionic/react"
import { Geolocation } from '@capacitor/geolocation';
import { useEffect, useState } from "react";
import axios from "axios";

const GetLoacation = (props) => {
    const [region,setRegion] = useState("جاري جلب المنطقة")
    const [country,setCountry] = useState("جاري جلب الدوالة")

    useEffect(() => {
        printCurrentPosition()
    },[])

    useEffect(() => {
        handleLoacation()
    },[country,region])
    
const printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    try{
        await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.coords.latitude}&lon=${coordinates.coords.longitude}&format=json&accept-language=ar`).then(res => {
        console.log(res);
        setRegion(res.data.address.state || res.data.address.region)
        setCountry(res.data.address.country)
    })
    } catch(e){
        console.log(e.response);
        setRegion("")
        setCountry("")
    }
  };

  const handleLoacation = () => {
    props.country(country);
    props.region(region)
  }
    return(
        <IonItem>
            <IonLabel color="warning">الدولة</IonLabel>
                <IonInput disabled value={country} />
                    <IonLabel color="warning">المنطقة</IonLabel>
                <IonInput disabled value={region}/>
        </IonItem>
    )
}
export default GetLoacation;