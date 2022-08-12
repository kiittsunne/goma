import React, { useState, useEffect } from "react";
import ErrorToast from "../components/ErrorToast";
import welcomeSvg from "../assets/signup.png";

const SignUpForm = () => {
  /* #region  Success & Error toast state utils */
  const [toastMessage, setToastMessage] = useState("");

  const [showSuccessToast, setShowSuccessToast] = useState("hide");
  function handleShowSuccessToast() {
    showSuccessToast === "hide"
      ? setShowSuccessToast("show")
      : setShowSuccessToast("hide");
  }

  const [showErrorToast, setShowErrorToast] = useState("hide");
  function handleShowErrorToast() {
    showErrorToast === "hide"
      ? setShowErrorToast("show")
      : setShowErrorToast("hide");
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowErrorToast("hide");
    }, 2000);
    return () => clearTimeout(timer);
  }, [showErrorToast]);
  /* #endregion */

  /* #region  Form data state utils */
  const [inputType, setInputType] = useState("password");
  const [checkedState, setCheckedState] = useState(false);

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    isMaker: checkedState,
  });
  function handleInputType(event) {
    event.preventDefault();
    inputType === "password" ? setInputType("text") : setInputType("password");
  }
  function toggle(value) {
    return !value;
  }
  function handleCheckedState() {
    checkedState === false ? setCheckedState(true) : setCheckedState(false);
  }
  function handleChange(event) {
    event.preventDefault();
    const { id, value } = event.target;
    if (id === "isMaker") return;
    setInput({ ...input, [id]: value });
  }
  /* #endregion */

  /* #region  Signup User async function */
  async function signupUser(event) {
    event.preventDefault();
    if (!input.email || !input.password || !input.username) {
      setToastMessage("Missing Information.");
      setShowErrorToast("show");
      return;
    }
    try {
      setInput({ username: "", email: "", password: "", isMaker: false });
      setCheckedState(false);
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      };
      const response = await fetch(
        "http://localhost:5001/api/signup",
        requestOptions
      );
      const data = await response.json();
      if (data.status === 201) {
        setToastMessage("Success! Please Log In.");
        setShowSuccessToast("show");
      } else {
        setToastMessage(data.message);
        setShowErrorToast("show");
      }
    } catch (err) {
      setToastMessage(`${err.message}`);
      setShowErrorToast("show");
    }
  }
  /* #endregion */
  useEffect(() => {
    setInput({ ...input, isMaker: checkedState });
  }, [checkedState]);
  useEffect(() => {
    console.log(input);
  }, [input]);
  return (
    <>
      {showErrorToast === "hide" ? (
        ""
      ) : (
        <ErrorToast
          message={toastMessage}
          handleShowToast={handleShowErrorToast}
          color={"dark"}
        />
      )}
      {showSuccessToast === "hide" ? (
        ""
      ) : (
        <ErrorToast
          message={toastMessage}
          handleShowToast={handleShowSuccessToast}
          color={"success"}
        />
      )}
      <div
        className="d-flex flex-row justify-content-between align-items-center container-sm"
        style={{ marginTop: "20vh" }}
      >
        <div
          className="d-none d-lg-block"
          style={{ maxWidth: "350px", marginLeft: "8em" }}
        >
          <img src={welcomeSvg} className="img-fluid" alt="welcomesvg" />
        </div>
        <div
          id="signup"
          className="d-flex flex-column align-items-center container-md "
          style={{ maxWidth: "450px" }}
        >
          <div className="mb-3 w-75 ps-2">
            <h2 style={{ color: `var(--purple)` }}>Sign Up</h2>
          </div>

          <div className="justify-content-center row mt-2 w-75">
            <form onSubmit={signupUser}>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-person-circle"></i>
                </span>
                <div className="form-floating">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="form-control"
                    placeholder="John Doe"
                    value={input.username}
                    onChange={handleChange}
                  />
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                </div>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <div className="form-floating">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="user@email.com"
                    value={input.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                </div>
              </div>
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={handleInputType}
                >
                  <i className="bi bi-eye-fill"></i>
                </span>
                <div className="form-floating">
                  <input
                    type={inputType}
                    name="password"
                    id="password"
                    className="form-control"
                    placeholder="password"
                    value={input.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                </div>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  checked={checkedState}
                  type="checkbox"
                  id="isMaker"
                  onChange={() => setCheckedState(toggle)}
                />
                <label class="form-check-label" htmlFor="isMaker">
                  I'm a Maker!{" "}
                  <span style={{ color: `var(--grey)` }}>
                    (You can change this later)
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="btn w-100 mt-4 text-white"
                style={{ backgroundColor: `var(--purple)` }}
              >
                Sign Up
              </button>
              <a href="/login" style={{ textDecoration: "none" }}>
                <p
                  className="text-center m-2 text-muted sm fs-6 fw-lighter"
                  style={{ cursor: "pointer" }}
                >
                  Log In
                </p>
              </a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
