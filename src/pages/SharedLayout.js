import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

const SharedLayout = () => {
  const user = useAuthState().user;
  useEffect(() => {}, [user]);
  return (
    <>
      <Navbar user={user} />
      <Outlet />
    </>
  );
};

export default SharedLayout;
