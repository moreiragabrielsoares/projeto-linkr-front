import { Body, Main, Container, Top, Center } from "../styledComponents/userPageStyledComponents";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";
import { config, backUrl } from "../Scripts/constants";

import Header from "../Components/Header";
import ModalWindow from "../Components/Modal";
import ListPosts from "../Components/ListPosts";
import HashtagsBox from "../Components/HashtagsBox";

export default function UserPage() {
  const { id } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [idPostForDelete, setIdPostForDelete] = useState();
  const [reloadPosts, setReloadPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(null);
  const userPage = true;
  
  useEffect(() => {
    setIsLoading(true);
    const response = axios.get(`${backUrl}user/${ id }`);
    
    response.then((r) => {
      setUserPosts([...r.data]);
      setIsLoading(false);
    }).catch((r) => {
      alert(`Error ${ r.response.status }!`);
      setIsLoading(false);
    });
  }, [id, reloadPosts]);

  useEffect(() => {
    const response = axios.get(`${backUrl}user/following/${ id }`, config);

    response.then((r) => {
      setIsFollowing(r.data.following);
    }).catch((r) => {
      alert(`Error ${ r.response.status }!`);
      setIsLoading(false);
    });
  }, [id, isFollowing]);

  function checkFollowing() {
    if (isFollowing === null) {
      return <></>
    } else if (!isFollowing) {
      return <button className="no-following">Follow</button>
    } else if (isFollowing) {
      return <button className="following">Unfollow</button>
    }
  }

  return (
    <>
      <ModalWindow
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        idPostForDelete={idPostForDelete}
        reloadPosts={reloadPosts}
        setReloadPosts={setReloadPosts}
      />
      <Body isLoading={ isLoading } modalIsOpen={modalIsOpen} >
        <Header />
        {isLoading ? 
          <ThreeCircles color={"#FFFFFF"}/> 
        : 
          <Main isLoading={ isLoading } >
              <Container>
                <Top>
                  <div className="left">
                    <img src={ userPosts[0].userPhoto } alt="" />
                    <h1>{ userPosts[0].userName }'s posts</h1>
                  </div>
                  {checkFollowing()}
                </Top>
                <Center>
                  <div className="left-side">
                    {userPosts[0].postId ?
                        <ListPosts
                          posts={userPosts}
                          userPage={userPage}
                          setModalIsOpen={setModalIsOpen}
                          setIdPostForDelete={setIdPostForDelete}
                        />
                      :
                        <div className="no-posts">
                          <h2>There are no posts yet.</h2>
                        </div>
                      }
                  </div>
                  <div className="right-side">
                    <HashtagsBox reloadPosts={reloadPosts} />
                  </div>
                </Center>
              </Container>
          </Main>
        }
      </Body>
    </>
  );
}

