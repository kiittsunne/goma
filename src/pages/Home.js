import React, { useState, useEffect } from "react";
import { useAuthState, useUpdateAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { name, token, id } = useAuthState().user;
  const initUserInfo = {
    email: "",
  };
  const [userInfo, setUserInfo] = useState(initUserInfo);
  useEffect(() => {
    async function getUserInfo() {
      const url = "http://localhost:5001/api/users/" + id;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        setUserInfo({ email: data.email });
      } catch (err) {
        // console.log(err.message);
      }
    }
    getUserInfo();
  }, [id]);

  const logout = useUpdateAuthContext().logoutUser;
  const navigate = useNavigate();

  return (
    <div className="container-md">
      <h1>Hello {name}</h1>
      <h2>Email {userInfo.email}</h2>
      <button
        className="btn btn-secondary"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Log Out
      </button>
    </div>
  );
};

export default Home;
