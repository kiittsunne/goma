import React from "react";
import { useAuthState } from "../contexts/AuthContext";

const ItemList = ({ item, handleUpdateItem, getItems }) => {
  const { token } = useAuthState().user;

  const handleDelete = async () => {
    const id = item._id;
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    try {
      const data = await fetch(
        `http://localhost:5001/api/items/delete/${id}`,
        requestOptions
      );
      const json = await data.json();
      getItems();
      console.log(json);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="d-flex flex-row border mb-2">
      <div
        className="w-25"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: `var(--grey)`,
          height: "120px",
        }}
      ></div>
      <div className="w-75 d-flex flex-column">
        <div className="d-flex flex-row justify-content-between align-items-center p-2">
          <div className=" w-100 d-flex flex-row justify-content-between bg-light ps-2 rounded fs-5">
            {item.name}
            <div
              className="d-flex flex-row text-grey align-items-center"
              style={{ fontSize: "11pt" }}
            >
              <span className="me-1">
                <i class="bi bi-heart-fill" style={{ fontSize: "9pt" }}></i> 0
              </span>
              <span className="ms-1 me-1">
                <i class="bi bi-eyeglasses" style={{ fontSize: "12pt" }}></i> 0
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="ps-2 mx-2 mt-2 d-flex flex-row justify-content-between align-items-center">
            <div>
              <div>
                {item.price && (
                  <div style={{ fontSize: "11pt" }}>
                    <span className="me-2">Price: ${item.price}</span>
                    <span>
                      Stock:{" "}
                      {item.stock === 0 ? (
                        <span className="text-red">"Sold Out"</span>
                      ) : (
                        item.stock
                      )}
                    </span>
                  </div>
                )}
                {!item.price && (
                  <button
                    className="btn btn-sm p-0 px-1 text-white"
                    style={{
                      backgroundColor: `var(--purple)`,
                      fontSize: "11pt",
                    }}
                  >
                    Click for Price & Stock
                  </button>
                )}
              </div>
              <div className="mt-1" style={{ fontSize: "11pt" }}>
                Variations: {item.dimension_enabled === true ? " Yes" : " None"}
              </div>
            </div>
            <div>
              <button
                className="btn btn-sm text-white me-2"
                style={{ backgroundColor: `var(--purple)` }}
                data-bs-toggle="modal"
                data-bs-target="#updateModal"
                type="submit"
                onClick={() => {
                  handleUpdateItem(item);
                }}
              >
                <i class="bi bi-pencil-square"></i>
              </button>
              <button
                className="btn btn-sm text-white"
                style={{ backgroundColor: `var(--grey)` }}
                onClick={handleDelete}
              >
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemList;
