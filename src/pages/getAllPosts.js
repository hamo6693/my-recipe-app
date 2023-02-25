import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
} from "@ionic/react";
import Header from "../components/Header/Header";
import noImg from "./assets/images/no_image.png";
import avatar from "./assets/images/avatar.png";
import "./assets/styles/getAllPosts.css";
import axios from "../config/axios";
import { GET_ALL_POSTS } from "../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import "moment/locale/ar";

moment.locale("ar");

const GetAllPosts = () => {
  const [showLoading, setShowLoading] = useState(false);

  const [posts, setPosts] = useState();

  const { jwt } = useContext(AuthContext);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    setShowLoading(true);
    try {
      await axios
        .get(GET_ALL_POSTS, {
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
  function doRefresh(event) {
    setTimeout(() => {
      getPosts();
    }, 10000);
  }
  return (
    <IonPage>
      {showLoading ? (
        <IonLoading isOpen={showLoading} />
      ) : (
        posts && (
          <>
            <Header headerTitle="وصفاتي" disabledBackButton="true" />
            <IonContent className="ion-padding">
              <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                <IonRefresherContent></IonRefresherContent>
              </IonRefresher>
              <IonGrid>
                <IonRow>
                  {posts.length > 0 ? (
                    posts
                      .slice()
                      .reverse()
                      .map((post) => {
                        return (
                          <IonCol sizeMd="6" size="12" key={post.id}>
                            <IonCard
                              routerLink={`/my-recipe/all-posts/${post.id}`}
                            >
                              <IonImg
                                src={post.Post_Images[0].img_uri}
                                className="post-image"
                              />
                              <IonCardContent>
                                <IonGrid>
                                  <IonRow>
                                    <IonAvatar className="post-avatar">
                                      {post.User.img_uri ? (
                                        <IonImg src={post.User.img_uri} />
                                      ) : (
                                        <IonImg src={avatar} />
                                      )}
                                    </IonAvatar>
                                    <IonCol>
                                      <IonText className="post-user">
                                        {post.User.name}
                                      </IonText>
                                      <IonText
                                        color="warning"
                                        className="post-moment"
                                      >
                                        {moment(post.createdAt).fromNow()}
                                      </IonText>
                                    </IonCol>
                                  </IonRow>
                                  <IonCardTitle
                                    color="primary"
                                    className="post-title "
                                  >
                                    {post.title}
                                  </IonCardTitle>
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
                    <IonCol sizeMd="6" offsetMd="3">
                      <IonCard className="ion-padding ion-text-center">
                        <IonCardTitle color="primary">
                          لا يوجد منشور لعرضه
                        </IonCardTitle>
                      </IonCard>
                    </IonCol>
                  )}
                </IonRow>
              </IonGrid>
            </IonContent>
          </>
        )
      )}
    </IonPage>
  );
};
export default GetAllPosts;
