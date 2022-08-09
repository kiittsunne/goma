import React, { useState } from "react";

const ErrorToast = (props) => {
  const [showState, setShow] = useState("show");
  function handleToast() {
    props.handleShowToast();
    setShow("hide");
  }
  return (
    <div
      className={`toast mt-4 start-50 translate-middle-x align-items-center text-white bg-${props.color} border-0 fade  ${showState}`}
      style={{ zIndex: 100, position: "absolute" }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-autohide={false}
    >
      <div className="d-flex">
        <div className="toast-body">{props.message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={handleToast}
        ></button>
      </div>
    </div>
  );
};

export default ErrorToast;
