import React, { useState, useEffect } from "react";
import { useAuthState } from "../contexts/AuthContext";

const Navbar = () => {
  const [accountBtn, setAccountBtn] = useState("login");
  const { name, isMaker } = useAuthState().user;
  useEffect(() => {
    if (name !== "Stranger") setAccountBtn("home");
  }, [name]);
  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-lg">
        {/* GOMA logo */}
        <a href="/" className="navbar-brand">
          <span
            className="navbar-brand fw-bold text-secondary"
            style={{ fontFamily: "Caveat Brush", fontSize: "1.3em" }}
          >
            <i style={{ color: "#b4a7c6" }}>G</i>
            <i style={{ color: "#deac79" }}>O</i>
            <i style={{ color: "#cb6761" }}>M</i>
            <i style={{ color: "#a8b38c" }}>A</i>
          </span>
        </a>

        {/* Searchbar Styles */}
        <div>
          <form className="form-inline d-flex flex-row justify-content-center align-items-center">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn text-white"
              style={{ marginLeft: ".5em", backgroundColor: "#a3a3a3" }}
              type="submit"
            >
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>

        {/* Menu burger toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-nav"
          aria-controls="main-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Buttons */}
        <div
          className="collapse navbar-collapse justify-content-end align-center"
          id="main-nav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <div id="accountBtn">
                <a href={`/cart`} className="nav-link">
                  <span
                    className="bi bi-cart-fill mx-2"
                    style={{
                      fontSize: "20px",
                      paddingLeft: ".05em",
                      color: "#cb6761",
                    }}
                  ></span>
                  <span className="d-sm-none">My Cart</span>
                </a>
              </div>
            </li>
            {name !== "Stranger" && isMaker === true ? (
              <li className="nav-item">
                <div id="accountBtn">
                  <a href={`/my-shop`} className="nav-link">
                    <span
                      className="bi bi-shop-window mx-2"
                      style={{
                        fontSize: "20px",
                        paddingLeft: ".05em",
                        color: `var(--green)`,
                      }}
                    ></span>
                    <span className="d-sm-none">My Shop</span>
                  </a>
                </div>
              </li>
            ) : (
              ""
            )}
            <li className="nav-item">
              <div id="accountBtn">
                <a href={`/${accountBtn}`} className="nav-link">
                  <span className="mx-2">
                    <img
                      src="https://source.boringavatars.com/beam/22/Victoria%20Woodhul?colors=cb6761,deac79,a8b38c,8bbfbf,b4a7c6"
                      alt="avatar"
                    />
                  </span>
                  <span className="d-sm-none">Login / Signup</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
