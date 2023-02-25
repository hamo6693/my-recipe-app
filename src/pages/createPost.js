import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { images } from "ionicons/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Header from "../components/Header/Header";
import TextEditor from "../components/TextEditor/TextEditor";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import "./assets/styles/createPost.css";
import "swiper/css";
import GetLoacation from "../components/Loacation/GetLoacation";
import axios from "../config/axios";
import { CREATE_POST } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router";
import { EditorState } from "draft-js";

const CreatePost = () => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [region, setRegion] = useState();
  const [country, setCountry] = useState();
  const takePhotoRef = useRef();
  const [steps, setSteps] = useState();
  const { takePhoto, blobUrl } = usePhotoGallery();
  const [photos, setPhotos] = useState([]);
  const [showImageToast, setShowImageToast] = useState(false);
  const [showContentToast, setShowContentToast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const history = useHistory();

  const { jwt } = useContext(AuthContext);

  const onSubmit = async () => {
    const postData = new FormData();
    try {
      postData.append("title", title);
      postData.append("contents", content);
      postData.append("steps", steps);
      postData.append("country", country);
      postData.append("region", region);
      for (let i = 0; i < photos.length; i++) {
        const response = await fetch(photos[i]);
        const blob = await response.blob();
        postData.append("postImg", blob);
      }
      await axios
        .post(CREATE_POST, postData, {
          headers: {
            Authorization: jwt,
          },
        })
        .then((res) => {
          console.log(res);
          setPhotos([]);
          setContent("");
          setTitle("");
          setShowAlert(true);
        });
    } catch (e) {
      console.log(e.response);
    }
  };

  useEffect(() => {
    if (blobUrl) {
      const imgUrls = [blobUrl, ...photos];
      setPhotos(imgUrls);
    }
  }, [blobUrl]);
  console.log(steps);

  const validator = () => {
    if (photos.length > 0) {
      if (steps && content && region) {
        onSubmit();
      } else {
        setShowContentToast(true);
      }
    } else {
      setShowImageToast(true);
    }
  };

  return (
    <IonPage>
      <Header headerTitle="نشر منشور" defaultHref="all-posts" />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="تمت عملية نشر المنشور بنجاح"
        message="لقد تم نشر المنشور يمكنك الانتقال الى صفحة المنشورات"
        buttons={[
          {
            text: "موافق",
            handler: () => {
              history.push("/my-recipe/all-posts");
            },
          },
        ]}
      />
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol sizeMd="6" offsetMd="3" sizeLg="4" offsetLg="4">
              <IonList>
                <IonItem>
                  <IonLabel position="floating" color="warning">
                    العنوان
                  </IonLabel>
                  <IonInput
                    value={title}
                    onIonChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </IonItem>

                <IonItem className="ion-margin-bottom">
                  <IonLabel position="floating" color="warning">
                    المكونات
                  </IonLabel>
                  <IonTextarea
                    value={content}
                    onIonChange={(e) => setContent(e.target.value)}
                  />
                </IonItem>
                <IonLabel className="ion-margin">خطوات التحضير</IonLabel>
                <IonItem className="ion-margin">
                  <TextEditor
                    sendToParent={setSteps}
                    editorState={EditorState.createEmpty()}
                  />
                </IonItem>
                <IonItem lines="none" ref={takePhotoRef} onClick={takePhoto}>
                  <IonText>اضغط هنا لاضافة الصورة</IonText>
                </IonItem>
                <IonItem className="ion-margin-bottom" lines="none">
                  {photos.length > 0 ? (
                    <Swiper>
                      {photos.map((img, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <IonImg
                              src={img}
                              onClick={() => takePhotoRef.current.click()}
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  ) : (
                    <div className="icon-container">
                      <IonIcon
                        icon={images}
                        color="primary"
                        className="icon-images"
                        onClick={() => takePhotoRef.current.click()}
                      />
                    </div>
                  )}
                </IonItem>

                <GetLoacation country={setCountry} region={setRegion} />
                <div>
                  <IonButton
                    expand="block"
                    className="ion-margin"
                    onClick={validator}
                  >
                    نشر
                  </IonButton>
                </div>
              </IonList>
              <IonToast
                isOpen={showImageToast}
                onDidDismiss={() => setShowImageToast(false)}
                message="يجب ادخال صورة على الاقل"
                duration={1500}
                color="danger"
              />
              <IonToast
                isOpen={showContentToast}
                onDidDismiss={() => setShowContentToast(false)}
                message="يجب ادخال جميع الحقول"
                duration={1500}
                color="danger"
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CreatePost;
