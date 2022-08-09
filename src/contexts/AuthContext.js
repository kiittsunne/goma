import React, { useReducer, useEffect, useContext } from "react";

/* #region  User info context provider */
const AuthStateContext = React.createContext();
export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
}
/* #endregion */

/* #region  Auth Context Dispatch providers */
const AuthDispatchContext = React.createContext();
export function useUpdateAuthContext() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
}
/* #endregion */

/* #region  Declare User & Token */
let user = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")).user
  : "";

let token = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")).accessToken
  : "";
/* #endregion */

/* #region  AuthReducer & Initial State */

const initialState = {
  name: "Stranger" || user,
  token: "" || token,
  loading: false,
  errorMessage: "",
  id: "",
  isMaker: false,
};

const ACTIONS = {
  REQUEST_LOGIN: "login-req",
  LOGIN_SUCCESS: "login-ok",
  LOGIN_ERROR: "login-fail",
  LOGIN_STATUS_CHECK: "login-check",
  LOGOUT: "logout",
  REFRESH: "refresh",
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case ACTIONS.REQUEST_LOGIN:
      return {
        ...initialState,
        loading: true,
      };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...initialState,
        name: action.payload.user,
        token: action.payload.accessToken,
        id: action.payload.id,
        loading: false,
        isMaker: action.payload.isMaker,
      };
    case ACTIONS.LOGIN_STATUS_CHECK:
      return {
        ...initialState,
        name: action.payload.user,
        token: action.payload.token,
        id: action.payload.id,
        isMaker: action.payload.isMaker,
      };
    case ACTIONS.LOGOUT:
      return {
        ...initialState,
        name: "Stranger",
        token: "",
        id: "",
      };
    case ACTIONS.LOGIN_ERROR:
      return {
        ...initialState,
        loading: false,
        errorMessage: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
/* #endregion */

// AuthProvider State & API interactions
export function AuthProvider({ children }) {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  const API_ROOT = "http://localhost:5002/api";
  async function loginUser(loginPayload) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginPayload),
    };

    try {
      dispatch({ type: "login-req" });
      let response = await fetch(`${API_ROOT}/login`, requestOptions);
      let data = await response.json();

      if (data.user) {
        dispatch({ type: "login-ok", payload: data });
        document.cookie = `refreshToken=${
          data.refreshToken
        }; expires=${new Date(Date.now() + 12096e5).toUTCString()}`;
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            user: data.user,
            token: data.accessToken,
            id: data.id,
            isMaker: data.isMaker,
          })
        );
        return data;
      } else {
        dispatch({ type: "login-fail", payload: data.message });
        return data.message;
      }
    } catch (err) {
      dispatch({ type: "login-fail", payload: err.message });
    }
  }

  function logoutUser() {
    localStorage.removeItem("currentUser");
    dispatch({ type: "logout" });
  }

  useEffect(() => {
    const item = localStorage.getItem("currentUser");

    if (item) {
      dispatch({ type: "login-check", payload: JSON.parse(item) });
    }
  }, []);

  return (
    <AuthStateContext.Provider value={{ user }}>
      <AuthDispatchContext.Provider value={{ loginUser, logoutUser }}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}
