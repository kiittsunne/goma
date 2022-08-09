import React from "react";
import MyItems from "./MyItems";
import MyOrders from "./MyOrders";
import MyShopSettings from "./MyShopSettings";

const ShopModules = () => {
  return (
    <div className="container-sm" style={{ maxWidth: "800px" }}>
      <ul className="nav nav-pills nav-fill mb-4" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
            // style={{ backgroundColor: `var(--purple)` }}
          >
            My Items
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Orders (0 pending)
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="pills-contact-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-contact"
            type="button"
            role="tab"
            aria-controls="pills-contact"
            aria-selected="false"
          >
            Shop Settings
          </button>
        </li>
      </ul>
      <div className="tab-content" id="pills-tabContent">
        <MyItems />
        <MyOrders />
        <MyShopSettings />
      </div>
    </div>
  );
};

export default ShopModules;
