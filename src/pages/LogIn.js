import React, { useEffect, useState } from "react";
import { useUpdateAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import loginSvg from "../assets/login.png";
import ErrorToast from "../components/ErrorToast";

const LogInForm = () => {
  /* #region  Error toast state utils */
  const [showToast, setShowToast] = useState("hide");
  const [toastMessage, setToastMessage] = useState("");
  function handleShowToast() {
    showToast === "hide" ? setShowToast("show") : setShowToast("hide");
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast("hide");
    }, 2000);
    return () => clearTimeout(timer);
  }, [showToast]);
  /* #endregion */

  /* #region  Form data state utils */
  const [input, setInput] = useState({ email: "", password: "" });
  function handleChange(event) {
    event.preventDefault();
    const { id, value } = event.target;
    setInput({ ...input, [id]: value });
  }
  const [inputType, setInputType] = useState("password");
  function handleInputType(event) {
    event.preventDefault();
    inputType === "password" ? setInputType("text") : setInputType("password");
  }
  const login = useUpdateAuthContext().loginUser;
  const navigate = useNavigate();
  /* #endregion */

  /* #region  Login User async function */
  async function loginUser(event) {
    event.preventDefault();
    setInput({ email: "", password: "" });
    if (!input.email || !input.password) {
      setToastMessage("Missing Information.");
      setShowToast("show");
      return;
    }
    try {
      const response = await login(input);
      if (response.user) {
        navigate("/");
      } else {
        setToastMessage(response);
        setShowToast("show");
      }
    } catch (err) {
      setToastMessage(`${err.message}`);
      setShowToast("show");
    }
  }
  /* #endregion */

  return (
    <>
      {showToast === "hide" ? (
        ""
      ) : (
        <ErrorToast
          message={toastMessage}
          handleShowToast={handleShowToast}
          color={"dark"}
        />
      )}
      <div
        className="d-flex flex-row justify-content-between align-items-center container-sm"
        style={{ marginTop: "24vh" }}
      >
        <div
          className="d-none d-lg-block"
          style={{ maxWidth: "350px", marginLeft: "8em" }}
        >
          <img src={loginSvg} className="img-fluid" alt="loginsvg" />
        </div>
        <div
          id="signup"
          className="d-flex flex-column align-items-center justify-content-center container-md mt-4"
          style={{
            maxWidth: "450px",
          }}
        >
          <div className="mb-3 w-75 ps-2">
            <h2 style={{ color: `var(--orange)` }}>Log In</h2>
          </div>

          <div className="justify-content-center row mt-2 w-75">
            <div>
              <form onSubmit={loginUser}>
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
                      autoFocus={true}
                    />
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                  </div>
                </div>
                <div className="input-group">
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
                <button
                  type="submit"
                  className="btn w-100 mt-4 text-white"
                  style={{ backgroundColor: `var(--orange)` }}
                >
                  Log In
                </button>
                <a href="signup" style={{ textDecoration: "none" }}>
                  <p
                    className="text-center m-2 text-muted sm fs-6 fw-lighter"
                    style={{ cursor: "pointer" }}
                  >
                    Sign Up
                  </p>
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogInForm;
