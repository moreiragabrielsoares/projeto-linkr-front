import styled from "styled-components";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header({ isLoading }) {
  const [search, setSearch] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [showSearchUsers, setShowSearchUsers] = useState(false);
  const user = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();

  useEffect(() => {
    if (search.length >= 3) {
      const response = axios.get(`https://projeto17-back.herokuapp.com/user?user=${search}`);
  
      response.then((r) => {
        setUsersList([...r.data]);
        setShowSearchUsers(true);
      }).catch((r) => {
        alert(`Erro ${ r.response.status }!`);
      });
    } else if (search.length < 3) {
      setUsersList([]);
      setShowSearchUsers(false);
    }
  }, [search]);

  return (
    <Head>
      <h1>linkr</h1>
      <Center>
        <div className="bar">
          <DebounceInput
            type="text"
            placeholder="Search for people"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            debounceTimeout={300}
            disabled={isLoading}
          />
          <button><AiOutlineSearch color="#C6C6C6" size={"21px"} /></button>
        </div>
        {showSearchUsers ?
        <div className="list-user">
          {(usersList.length >= 1) ?
            usersList.map((user, index) => 
              <div className="user" key={index} onClick={() => {
                  setSearch('');
                  navigate(`/user/${user.id}`);
                }}>
                <img src={user.userPhoto} alt="" />
                <h2>{user.name}</h2>
              </div>
            )
          :
            <h3>Não foram encontrados usuários.</h3>
          }
        </div>
        : <></>
        }
      </Center>
      <div className="right">
        <BsChevronDown color="#FFFFFF"size={"21px"} />
        <img src={user.photo} alt="usuario" />
      </div>
    </Head>
  );
}

const Head = styled.header`
  background-color: #151515;

  width: 100%;
  height: 72px;
  padding: 0 30px;
  z-index: 1;
  top: 0;
  left: 0;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;

  h1 {
    color: #FFFFFF;
    font-family: "Passion One";
    font-size: 49px;
    font-weight: 700;
  }
  
  .right {
    display: flex;
    align-items: center;

    img {
      border-radius: 50%;
      object-fit: cover;

      width: 50px;
      height: 50px;
      margin-left: 10px;
    }
  }
`;

const Center = styled.div`
  background-color: #FFFFFF;
  border-radius: 8px;

  width: 50%;

  display: flex;
  flex-direction: column;
  position: relative;

  .bar {
    width: 100%;
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    input {
      font-size: 19px;
      outline: none;
      border-radius: 8px;

      width: 100%;
      padding: 0 15px;

      ::placeholder {
        color: #C6C6C6;
        font-size: 19px;
      }
    }

    button {
      background-color: #FFFFFF;
      border: none;
      border-radius: 8px;
      margin-right: 8px;
    }
  }

  .list-user {
    background-color: #E7E7E7;
    border-radius: 0 0 8px 8px;

    width: 100%;
    padding: 14px 15px 10px 15px;

    position: absolute;
    top: 40px;

    h2, h3 {
        color: #515151;
        font-family: "Lato";
        font-size: 19px;
        font-weight: 400;
      }

      h3 {
        margin-bottom: 13px;
      }

    .user {
      display: flex;
      align-items: center;
      cursor: pointer;

      width: 100%;
      margin-bottom: 13px;

      img {
        border-radius: 50%;
        object-fit: cover;

        width: 39px;
        height: 39px;
        margin-right: 12px;
      }
    }
  }
  
`;