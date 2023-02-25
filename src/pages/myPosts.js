import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  useIonActionSheet,
} from "@ionic/react";
import Header from "../components/Header/Header";
import noImg from "./assets/images/no_image.png";
import avatar from "./assets/images/avatar.png";
import "./assets/styles/getAllPosts.css";
import axios from "../config/axios";
import { GET_MY_POSTS, DELETE_POST } from "../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ellipsisVertical } from "ionicons/icons";
import "./assets/styles/getMyPosts.css";
import { useHistory } from "react-router";

const MyPosts = () => {
  const [showAlert, setShowAlert] = useState();

  const [postId, setPostId] = useState();

  const [showLoading, setShowLoading] = useState(false);

  const [posts, setPosts] = useState();

  const history = useHistory();

  const [present, dismiss] = useIonActionSheet();

  const { jwt } = useContext(AuthContext);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    setShowLoading(true);
    try {
      await axios
        .get(GET_MY_POSTS, {
          headers: {
            Authorization: jwt,
          },
        })
        .then((res) => {
          console.log(res);
          setPosts(res.data);
          setShowLoading(false);
        });
    } catch (e) {
      console.log(e.response);
      setShowLoading(false);
    }
  };

  const deletePost = async () => {
    setShowLoading(false);
    try {
      await axios
        .delete(DELETE_POST, {
          data: {
            postId: postId,
          },
          headers: {
            Authorization: jwt,
          },
        })
        .then((res) => {
          console.log(res);
          setShowLoading(false);
          getPosts();
        });
    } catch (e) {
      console.log(e.response);
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <Header headerTitle="منشوراتي" />
      {showLoading ? (
        <IonLoading isOpen={showLoading} duration={10000} />
      ) : (
        posts && (
          <>
            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => {
                setShowAlert(false);
              }}
              header={"تنبيه"}
              message={"هل تريد حذف المنشور"}
              buttons={[
                {
                  text: "نعم",
                  handler: () => {
                    deletePost();
                  },
                },
                {
                  text: "الغاء",
                  role: "cancel",
                },
              ]}
            />
            <IonContent className="ion-padding">
              <IonGrid>
                <IonRow>
                  <IonCol>
                    {posts.length > 0 ? (
                      posts
                        .slice()
                        .reverse()
                        .map((post) => {
                          return (
                            <IonCol sizeMd="6" size="12" key={post.id}>
                              <IonCard>
                                <IonImg src={post.Post_Images[0].img_uri} className="post-image" />
                                <IonCardContent>
                                  <IonGrid>
                                    <IonRow className="ion-justify-content-between">
                                      <IonCardTitle
                                        color="primary"
                                        className="post-title "
                                      >
                                        {post.title}
                                      </IonCardTitle>
                                      <IonButtons
                                        onClick={() => {
                                          present(
                                            [
                                              {
                                                text: "تعديل المنشور",
                                                handler: () => {
                                                  history.push(
                                                    `/my-recipe/my-posts/${post.id}`
                                                  );
                                                },
                                              },
                                              {
                                                text: "انتقال الى المنشور",
                                                handler: () => {
                                                  history.push(
                                                    `/my-recipe/all-Posts/${post.id}`
                                                  );
                                                },
                                              },
                                              {
                                                text: "حذف المنشور",
                                                handler: () => {
                                                  setPostId(post.id);
                                                  setShowAlert(true);
                                                },
                                              },
                                              {
                                                text: "الغاء",
                                                role: "cancel",
                                              },
                                            ],
                                            "تفاصيل المنشور"
                                          );
                                        }}
                                      >
                                        <IonIcon
                                          className="post-icon"
                                          icon={ellipsisVertical}
                                        />
                                      </IonButtons>
                                    </IonRow>
                                    <IonCardSubtitle className="post-contents">
                                      {post.contents}
                                    </IonCardSubtitle>
                                  </IonGrid>
                                </IonCardContent>
                              </IonCard>
                            </IonCol>
                          );
                        })
                    ) : (
                      <IonCol sizeMd="6" size="12">
                        <IonCard className="ion-padding ion-text-center">
                          <IonCardTitle color="primary">
                            لا يوجد منشور لعرضه
                          </IonCardTitle>
                        </IonCard>
                      </IonCol>
                    )}
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
export default MyPosts;
