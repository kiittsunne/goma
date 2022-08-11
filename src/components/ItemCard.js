import React from "react";

const ItemCard = ({ item }) => {
  return (
    <div className="card m-2 p-0">
      <div
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundColor: `var(--grey)`,
          height: "250px",
        }}
      ></div>
      <div className="card-body m-0">
        <div
          className="fw-bold lead w-100 mb-3"
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title={item.name}
        >
          {item.name}
        </div>
        <div className="d-flex flex-row justify-content-between">
          <button
            className="btn text-white w-75"
            style={{ backgroundColor: `var(--purple)` }}
          >
            Buy
          </button>
          <button
            className="btn text-white"
            style={{ backgroundColor: `var(--grey)` }}
          >
            <i class="bi bi-cart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
