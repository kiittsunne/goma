import React from "react";
import { useAuthState } from "../contexts/AuthContext";
import ShopModules from "../components/ShopModules";

const MyShop = () => {
  const { name } = useAuthState().user;
  return (
    <div className="container-md mt-4 ps-4 d-flex flex-column justify-content-around">
      <div
        className="d-flex flex-row justify-content-between align-items-center container-sm mb-3"
        style={{ maxWidth: "800px" }}
      >
        <div style={{ fontFamily: "Caveat Brush", fontSize: "3em" }}>
          <span className="fw-bold" style={{ color: `var(--grey)` }}>
            hi
          </span>
          {" " + name}
        </div>
        <div className="d-flex flex-row w-50 justify-content-end align-items-center">
          <div className="pe-4" style={{ color: `var(--grey)` }}>
            0 followers
          </div>
          <div
            style={{
              backgroundColor: "pink",
              height: "3em",
              width: "3em",
              borderRadius: "100pt",
            }}
          ></div>
        </div>
      </div>
      <ShopModules />
    </div>
  );
};

export default MyShop;
