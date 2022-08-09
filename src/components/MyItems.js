import React, { useState, useEffect } from "react";
import NewProductModal from "./NewProductModal";

const MyItems = () => {
  const test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const [text, setText] = useState("");
  const [textHelper, setTextHelper] = useState([]);

  return (
    <>
      <div
        className="tab-pane fade show active d-flex flex-column border border-1 rounded-2 px-4 py-2"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
        tabIndex="0"
      >
        {/* My Items Sub Nav Bar */}
        <div className="d-flex flex-row justify-content-between align-items-center">
          <div className="lead">Total 0 Items</div>
          <div>
            <button
              className="btn text-white"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              style={{ marginLeft: ".5em", backgroundColor: `var(--green)` }}
              type="submit"
            >
              <i className="bi bi-plus-circle-fill"></i>
            </button>
            <button
              className="btn text-white"
              style={{ marginLeft: ".5em", backgroundColor: "#a3a3a3" }}
              type="submit"
            >
              <i className="bi bi-funnel-fill"></i>
            </button>
          </div>
        </div>

        {/* Modal */}
        <NewProductModal />
      </div>
    </>
  );
};

export default MyItems;
