import React, { useState, useEffect } from "react";
import { useAuthState } from "../contexts/AuthContext";
import ItemList from "./ItemList";
import NewProductForm from "./NewProductForm";
import UpdateProductForm from "./UpdateProductForm";

const MyItems = () => {
  const { id, token } = useAuthState().user;
  const [items, setItems] = useState([]);

  async function getItems() {
    const seller_id = id;
    const requestOptions = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(
        `http://localhost:5001/api/items/${seller_id}`,
        requestOptions
      );
      const data = await response.json();
      if (data.status === 200) {
        setItems(data.data);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    const seller_id = id;
    const requestOptions = {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    async function getItems() {
      try {
        const response = await fetch(
          `http://localhost:5001/api/items/${seller_id}`,
          requestOptions
        );
        const data = await response.json();
        if (data.status === 200) {
          setItems(data.data);
        } else {
          console.log(data);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getItems();
  }, [token]);

  const [updateItem, setUpdateItem] = useState({});
  const handleUpdateItem = (item) => {
    setUpdateItem(item);
  };

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
          <div className="lead">Total Items: {items.length}</div>
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

        {/* Add New Item Modal */}
        <div
          class="modal fade"
          id="exampleModal"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add New Listing
                </h5>
                {/* <button type="button" className="pop btn border-0">
                  <i className="bi bi-box-arrow-up-right"></i>
                </button>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button> */}
              </div>
              <div className="modal-body">
                <NewProductForm getItems={getItems} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      <div
        class="modal fade"
        id="updateModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title" id="updateModalLabel">
                Edit Listing
              </h5>
              {/* <button type="button" className="pop btn border-0">
                  <i className="bi bi-box-arrow-up-right"></i>
                </button>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button> */}
            </div>
            <div className="modal-body">
              <UpdateProductForm
                item={updateItem}
                handleUpdateItem={handleUpdateItem}
                getItems={getItems}
              />
            </div>
          </div>
        </div>
      </div>

      {/* All Items */}

      <div className="flex flex-row mt-3">
        {items.map((item, index) => {
          return (
            <ItemList
              item={item}
              key={index}
              handleUpdateItem={handleUpdateItem}
              getItems={getItems}
            />
          );
        })}
      </div>
    </>
  );
};

export default MyItems;
