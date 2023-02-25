import {
  IonAvatar,
  IonCard,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Header from "../components/Header/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import { chatboxEllipsesOutline } from "ionicons/icons";
import "./assets/styles/getPost.css";
import avatar from "./assets/images/avatar.png";
import axios from "../config/axios";
import { GET_ALL_POSTS } from "../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import "moment/locale/ar";
import GetComment from "../components/Comment/GetComment";

import Like from "../components/Like/Like";
import CreateComment from "../components/Comment/CreateComment";
import { Editor, EditorState, convertFromRaw } from "draft-js";

moment.locale("ar");

const GetPost = (props) => {
  const [newComment, setNewComment] = useState();
  //وضع الاعجابات
  const [likeCount, setLikeCount] = useState();

  const [showLoading, setShowLoading] = useState(false);
  const [post, setPost] = useState();
  const [steps, setSteps] = useState();

  const postId = window.location.pathname.split("/")[3];
  const { jwt } = useContext(AuthContext);

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    setShowLoading(true);
    try {
      await axios
        .get(GET_ALL_POSTS + "/" + postId, {
          headers: {
            Authorization: jwt,
          },
        })
        .then((res) => {
          console.log(res);
          setPost(res.data);
          const contentState = convertFromRaw(JSON.parse(res.data.steps));
          const editorState = EditorState.createWithContent(contentState);
          setSteps(editorState);
          setShowLoading(false);
        });
    } catch (e) {
      console.log(e.response);
      setShowLoading(false);
    }
  };
  function getContent() {
    return document.querySelector("#content");
  }
  function scrollToBottom() {
    getContent().scrollToBottom(500);
  }

  return (
    <IonPage>
      {showLoading ? (
        <IonLoading isOpen={showLoading} duration={10000} />
      ) : (
        post && (
          <>
            <Header headerTitle={post.title} />
            <IonContent scrollEvents={true} id="content">
              <IonGrid>
                <IonRow>
                  <IonCol sizeMd="6" offsetMd="3" sizeLg="4" offsetLg="4">
                    {post.Post_Images.map((img) => {
                      return <IonImg src={img.img_uri} />;
                    })}

                    <IonGrid>
                      <IonRow>
                        <Like sendToParent={setLikeCount} />
                        <IonCol size="3">
                          <IonIcon
                            icon={chatboxEllipsesOutline}
                            color="primary"
                            className="post-icon"
                            onClick={() => {
                              scrollToBottom();
                            }}
                          />
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCardSubtitle className="post-like">
                          {likeCount} اعجاب
                        </IonCardSubtitle>
                      </IonRow>
                    </IonGrid>
                    <IonCard className="ion-no-margin ion-margin-bottom">
                      <IonGrid>
                        <IonRow className="ion-margin-top">
                          <IonAvatar>
                            {post.User.img_uri ? (
                              <IonImg src={post.User.img_uri} />
                            ) : (
                              <IonImg src={avatar} />
                            )}
                          </IonAvatar>
                          <IonCol>
                            <IonCardSubtitle className="post-username">
                              {post.User.name}
                            </IonCardSubtitle>
                            <IonCardSubtitle className="post-time">
                              {moment(post.createdAt).fromNow()}
                            </IonCardSubtitle>
                          </IonCol>
                          <IonCol className="ion-text-center">
                            <IonCardSubtitle>{post.country}</IonCardSubtitle>
                            <IonCardSubtitle>{post.region}</IonCardSubtitle>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                      <IonList>
                        <IonListHeader>
                          <IonText color="primary">
                            <h3>المكونات</h3>
                          </IonText>
                        </IonListHeader>
                        <IonItem lines="none">
                          <IonText>
                            <p>{post.contents}</p>
                          </IonText>
                        </IonItem>
                      </IonList>
                      <IonList>
                        <IonListHeader>
                          <IonText color="primary">
                            <h3>خطوات التخضير</h3>
                          </IonText>
                        </IonListHeader>
                        <IonItem lines="none">
                          <IonText>
                            <Editor editorState={steps} readOnly={true} />
                          </IonText>
                        </IonItem>
                      </IonList>
                    </IonCard>
                    <IonItemDivider color="light">
                      <IonText color="primary">
                        <h3 className="ion-no-margin">التعليقات</h3>
                      </IonText>
                    </IonItemDivider>

                    <GetComment comment={newComment} />

                    <IonItemDivider color="light">
                      <IonText color="primary">
                        <h3>اكتب تعليق</h3>
                      </IonText>
                    </IonItemDivider>
                    <CreateComment sendToParent={setNewComment} />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonContent>
          </>
        )
      )}
    </IonPage>
  );
};

export default GetPost;
