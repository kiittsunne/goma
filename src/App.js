import React from "react";
import { useAuthState } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import jumbotron from "./assets/goma.png";
import { categories } from "./data/categories";
import homeSvg from "./assets/home.svg";

const App = () => {
  const { name } = useAuthState().user;
  return (
    <>
      <Navbar />

      {/* Jumbotron */}
      <div
        style={{
          marginTop: "3em",
          paddingLeft: "1em",
          paddingRight: "1em",
          boxSizing: "border-box",
        }}
      >
        <div
          className="container-fluid d-flex flex-row justify-content-between p-0 rounded-4"
          style={{
            maxWidth: "1100px",
            border: "#a8b38c solid 2px",
          }}
        >
          <div
            className="d-flex flex-column"
            style={{ margin: "1em 1em 1em 1.5em", width: "100%" }}
          >
            <h1 className="display-2" style={{ fontFamily: "Caveat Brush" }}>
              <i style={{ color: "#b4a7c6" }}>Home </i>
              <i style={{ color: "#deac79" }}>of </i>
              <i style={{ color: "#cb6761" }}>SG </i>
              <i style={{ color: "#a8b38c" }}>Makers</i>
            </h1>
            <p className="lead fw-medium">
              Support local artists and makers. Browse our categories below ~
            </p>
            <div className="d-none d-sm-block">
              <div
                className="d-flex flex-row flex-wrap justify-content-start align-items-start"
                style={{ marginTop: "1em" }}
              >
                {categories.map((category, index) => {
                  return (
                    <div className="w-25">
                      <btn
                        key={index}
                        className="d-flex flex-column btn bg-light"
                        style={{
                          margin: "0.5em",
                          padding: ".5em 0 .5em 0",
                        }}
                      >
                        <img
                          src={require(`${category.image}`)}
                          className="image-fluid"
                          style={{
                            height: "2.5em",
                            width: "2.5em",
                            margin: "0 auto .5em auto",
                          }}
                        />
                        <p style={{ marginBottom: "0", textAlign: "center" }}>
                          {category.name}
                        </p>
                      </btn>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <img
            src={jumbotron}
            className="img-fluid"
            alt="jumbo"
            style={{ maxHeight: "35vh" }}
          />
        </div>
      </div>

      {/* Categories for mobile screen */}
      <div
        className="d-sm-none"
        style={{
          marginTop: "1em",
          paddingLeft: ".5em",
          paddingRight: ".5em",
          boxShadow: "border-box",
        }}
      >
        <div
          className="container-fluid d-flex flex-row justify-content-between p-0 rounded-4"
          style={{
            maxWidth: "1100px",
          }}
        >
          <div className="d-flex flex-row flex-wrap justify-content-start align-items-start">
            {categories.map((category, index) => {
              return (
                <div className="w-25">
                  <btn
                    key={index}
                    className="d-flex flex-column btn bg-light"
                    style={{
                      margin: "0.5em",
                      padding: ".5em 0 .5em 0",
                    }}
                  >
                    <img
                      src={require(`${category.image}`)}
                      className="image-fluid"
                      style={{
                        height: "2.5em",
                        width: "2.5em",
                        margin: "0 auto .5em auto",
                      }}
                    />
                    <p
                      style={{
                        marginBottom: "0",
                        textAlign: "center",
                        fontSize: ".6em",
                      }}
                    >
                      {category.name}
                    </p>
                  </btn>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Artists */}
      {/* <div
        className="container-fluid d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "4em" }}
      >
        <div className="" style={{ maxWidth: "550px" }}>
          <img src={homeSvg} className="img-fluid" alt="welcomesvg" />
        </div>
        <h1 className="display-4 mt-4">Hi {name}</h1>
      </div> */}
    </>
  );
};

export default App;
