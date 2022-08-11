import React, { useState, useEffect } from "react";
import { categories } from "../data/categories";
import { useAuthState } from "../contexts/AuthContext";

const NewProductForm = ({ getItems }) => {
  /* #region  Form Fields General State Management */
  const initNewItem = {
    name: "",
    description: "",
    category: null,
    subCategory: null,
    price: "",
    stock: "",
    dimension_enabled: false,
    dimension_main: { enabled: false, type: "", options: [] },
    dimension_sub: { enabled: false, type: "", option: [] },
    dimension_inventory: [],
    image: "",
  };
  const [input, setInput] = useState(initNewItem);
  const [subCategories, setSubCategory] = useState([]);
  const handleChange = (event) => {
    event.preventDefault();
    const { id, value } = event.target;
    if (id === "category") {
      const cat = categories.filter((category) => category.name === value);
      setSubCategory(cat[0].subCategories);
    }
    setInput({ ...input, [id]: value });
  };
  /* #endregion */

  /* #region  Variations Type, Options, Price, Stock State Management */
  const initHelper = { type: "", options: "" };
  const initOptions = { enabled: false, type: "", options: [] };
  const [main, setMain] = useState(initHelper);
  const [sub, setSub] = useState(initHelper);
  const [dimensions, setDimensions] = useState({
    enabled: false,
    editing: true,
    main: initOptions,
    sub: initOptions,
  });
  const [inventory, setInventory] = useState({
    showInputTable: false,
    editingInputTable: true,
    units: [],
  });
  const [inventoryHelper, setInventoryHelper] = useState(inventory.units);

  // Handler Functions
  const handleRemoveDimensions = (e) => {
    e.preventDefault();
    if (!dimensions.enabled) {
      setDimensions({ ...dimensions, enabled: true });
    }
    if (dimensions.enabled) {
      setDimensions({
        ...dimensions,
        enabled: false,
        editing: true,
        main: initOptions,
        sub: initOptions,
      });
      setMain(initHelper);
      setSub(initHelper);
      setInventory({
        showInputTable: false,
        editingInputTable: true,
        units: [],
      });
      setInventoryHelper(inventory.units);
    }
  };
  const handleDimensions = (e) => {
    if (dimensions.editing) {
      const mainOptions = main.options.split(",");
      mainOptions.forEach((option) => option.replace(/\s/g, ""));
      if (sub.type.length !== 0) {
        const subOptions = sub.options.split(",");
        subOptions.forEach((option) => option.replace(/\s/g, ""));
        setDimensions({
          ...dimensions,
          enabled: true,
          editing: false,
          main: {
            ...initOptions,
            enabled: true,
            type: main.type,
            options: mainOptions,
          },
          sub: {
            ...initOptions,
            enabled: true,
            type: sub.type,
            options: subOptions,
          },
        });
      } else {
        setDimensions({
          ...dimensions,
          enabled: true,
          editing: false,
          main: {
            ...initOptions,
            enabled: true,
            type: main.type,
            options: mainOptions,
          },
          sub: {
            ...initOptions,
          },
        });
      }
    } else {
      setDimensions({ ...dimensions, editing: true });
    }
  };
  const handleInventoryPriceStock = (e) => {
    e.preventDefault();
    if (inventory.editingInputTable) {
      setInventory({
        ...inventory,
        units: inventoryHelper,
        editingInputTable: false,
      });
    } else setInventory({ ...inventory, editingInputTable: true });
  };

  // Handler for form state changes during variation changes
  useEffect(() => {
    const initUnit = { mainOption: "", price: 0, stock: 0 };
    if (
      !dimensions.editing &&
      dimensions.main.enabled &&
      !dimensions.sub.enabled
    ) {
      const newUnits = dimensions.main.options.map((option) => {
        return { ...initUnit, mainOption: option };
      });
      // Case #1: Brand new listing with no existing inventory units
      if (inventory.units.length === 0) {
        setInventoryHelper(newUnits);
        setInventory({ ...inventory, units: newUnits, showInputTable: true });
      }
      // Case #2: Listing previously had sub-dimension, now being completely removed
      else if (Object.keys(inventory.units[0]).includes("subOption")) {
        setInventoryHelper(newUnits);
        setInventory({
          ...inventory,
          units: [],
          units: newUnits,
          showInputTable: true,
        });
        console.log("case2");
      }
      // Case #3: Listing has never had sub-dimension, but main options changed
      else {
        const existingOptions = inventory.units.map((unit) => unit.mainOption);
        let updatedUnits = inventory.units.filter((unit) => {
          return dimensions.main.options.includes(unit.mainOption);
        });
        dimensions.main.options.map((option) => {
          if (!existingOptions.includes(option)) {
            return updatedUnits.push({ ...initUnit, mainOption: option });
          }
        });
        updatedUnits.sort((a, b) => {
          return (
            dimensions.main.options.indexOf(a.mainOption) -
            dimensions.main.options.indexOf(b.mainOption)
          );
        });

        setInventoryHelper(updatedUnits);
        setInventory({
          ...inventory,
          units: updatedUnits,
          showInputTable: true,
        });
      }
    }
    if (
      !dimensions.editing &&
      dimensions.main.enabled &&
      dimensions.sub.enabled
    ) {
      // Case #1: Brand new listing with no existing inventory units
      if (inventory.units.length === 0) {
        const units = [];
        const [main, sub] = [dimensions.main.options, dimensions.sub.options];
        const [i, j] = [
          dimensions.main.options.length,
          dimensions.sub.options.length,
        ];
        for (let mainIndex = 0; mainIndex < i; mainIndex++) {
          for (let subIndex = 0; subIndex < j; subIndex++) {
            units.push({
              ...initUnit,
              mainOption: main[mainIndex],
              subOption: sub[subIndex],
            });
          }
        }
        setInventoryHelper(units);
        setInventory({ ...inventory, units: units, showInputTable: true });
      }
      // Case #2: Listing previously had no sub-dimensions, now being added
      else if (!Object.keys(inventory.units[0]).includes("subOption")) {
        const updatedUnits = [];
        inventory.units.forEach((unit) => {
          dimensions.sub.options.forEach((option) => {
            return updatedUnits.push({ ...unit, subOption: option });
          });
        });
        const filteredUnits = updatedUnits.filter((unit) => {
          if (Object.keys(unit).includes("subOption")) {
            return unit;
          }
        });
        setInventoryHelper(filteredUnits);
        setInventory({
          ...inventory,
          units: filteredUnits,
          showInputTable: true,
        });
      }
      // Case #3: Listing has sub-dimensions, either main or sub-dimensions were changed
      else {
        const existingMain = inventory.units.map((unit) => unit.mainOption);
        const existingSub = inventory.units.map((unit) => unit.subOption);
        let updatedUnits = inventory.units.filter((unit) => {
          return dimensions.main.options.includes(unit.mainOption);
        });

        dimensions.main.options.map((option) => {
          if (!existingMain.includes(option)) {
            dimensions.sub.options.forEach((subOption) => {
              return updatedUnits.push({
                ...initUnit,
                mainOption: option,
                subOption: subOption,
              });
            });
          }
        });

        let subUpdatedUnits = updatedUnits.filter((unit) => {
          return dimensions.sub.options.includes(unit.subOption);
        });
        dimensions.sub.options.map((option) => {
          if (!existingSub.includes(option)) {
            dimensions.main.options.forEach((mainOption) => {
              return subUpdatedUnits.push({
                ...initUnit,
                mainOption: mainOption,
                subOption: option,
              });
            });
          }
        });
        subUpdatedUnits
          .sort((a, b) => {
            return (
              dimensions.sub.options.indexOf(a.subOptions) -
              dimensions.sub.options.indexOf(b.subOptions)
            );
          })
          .sort((a, b) => {
            return (
              dimensions.main.options.indexOf(a.mainOption) -
              dimensions.main.options.indexOf(b.mainOption)
            );
          });
        setInventoryHelper(subUpdatedUnits);
        setInventory({
          ...inventory,
          units: subUpdatedUnits,
          showInputTable: true,
        });
      }
    }
    if (dimensions.editing)
      setInventory({ ...inventory, showInputTable: false });
  }, [dimensions]);

  // Handler for setInput on inventory changes
  useEffect(() => {
    if (!inventory.editingInputTable) {
      setInput({
        ...input,
        dimension_enabled: dimensions.enabled,
        dimension_main: dimensions.main,
        dimension_sub: dimensions.sub,
        dimension_inventory: inventory.units,
      });
    }
  }, [inventory]);
  /* #endregion */

  /* #region  Image Upload State Management */
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    setFileInputState(e.target.value);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };
  /* #endregion */

  /* #region  Form Submission State Management */

  const [isSaving, setIsSaving] = useState({
    state: false,
    display: "Save",
    message: "",
  });
  const handleClose = (e) => {
    setIsSaving({
      state: false,
      display: "Save",
      message: "",
    });
    setSubCategory([]);
    setFileInputState("");
    setPreviewSource("");
    setSelectedFile(null);
    handleRemoveDimensions(e);
    setInput(initNewItem);
    getItems();
  };

  // Converts file to Base644
  const handleImage = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      await handleSubmit(reader.result);
    };
    reader.onerror = () => {
      console.log("Something went wrong");
    };
  };

  // Injects additional data into Item object not provided by form inputs
  const { id: seller_id, token, name: seller_name } = useAuthState().user;

  // API call: Add New Listing
  const handleSubmit = async (base64image) => {
    setIsSaving(true);
    setInput({
      ...input,
      seller_id: seller_id,
      image: base64image,
      seller_name: seller_name,
    });
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    };
    try {
      const response = await fetch(
        "http://localhost:5001/api/items",
        requestOptions
      );
      const data = await response.json();
      if (data.status === 201) {
        setIsSaving({
          state: false,
          display: "Saved!",
          message: `${data.message}! You can close me now.`,
        });
      } else {
        setIsSaving({
          state: false,
          display: "Retry!",
          message: "Something went wrong!",
        });
        console.log(data);
      }
    } catch (err) {
      setIsSaving({
        state: false,
        display: "Oh No!",
        message: "Something went wrong!",
      });
      console.log(err.message);
    }
  };
  /* #endregion */

  return (
    <form enctype="multipart/form-data">
      {/* item name */}
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="~"
          value={input.name}
          onChange={handleChange}
        />
        <label htmlFor="name">
          Item Name <span style={{ color: `var(--grey)` }}>*</span>
        </label>
      </div>

      {/* item description */}
      <div className="form-floating mb-3">
        <textarea
          className="form-control"
          id="description"
          placeholder="~"
          value={input.description}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="description">
          Description <span style={{ color: `var(--grey)` }}>*</span>
        </label>
      </div>

      {/* item category & subcategory selector */}
      <div className="form-floating mb-3">
        <select
          className="form-select"
          id="category"
          aria-label="Item Category"
          placeholder="Category"
          defaultValue={input.category}
          onChange={handleChange}
        >
          <option selected disabled value="Category">
            Category
          </option>
          {categories.map((category, index) => {
            return (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            );
          })}
        </select>
        <label htmlFor="category">
          Select Category <span style={{ color: `var(--grey)` }}>*</span>
        </label>
      </div>
      {subCategories.length !== 0 && (
        <div className="form-floating mb-3">
          <select
            className="form-select"
            id="subCategory"
            aria-label="Item Sub-Category"
            placeholder="Sub-Category"
            defaultValue={input.subCategory}
            onChange={handleChange}
          >
            <option selected disabled value="Sub-Category">
              Sub-Category
            </option>
            {subCategories.map((subCategory, index) => {
              return (
                <option key={index} value={subCategory}>
                  {subCategory}
                </option>
              );
            })}
          </select>
          <label htmlFor="subCategory">
            Select Sub-Category <span style={{ color: `var(--grey)` }}>*</span>
          </label>
        </div>
      )}

      {/* item price & stock (no variation) */}
      <div className="d-flex flex-row align-content-center">
        <div className="form-floating mb-3 me-2" style={{ width: "50%" }}>
          <input
            type="number"
            className="form-control"
            id="price"
            placeholder="~"
            disabled={dimensions.enabled}
            value={input.price}
            onChange={handleChange}
          />
          <label htmlFor="price">
            Price <span style={{ color: `var(--grey)` }}>*</span>
          </label>
        </div>
        <div className="form-floating mb-3" style={{ width: "50%" }}>
          <input
            type="number"
            className="form-control"
            id="stock"
            placeholder="~"
            disabled={dimensions.enabled}
            value={input.stock}
            onChange={handleChange}
          />
          <label htmlFor="stock">
            Stock <span style={{ color: `var(--grey)` }}>*</span>
          </label>
        </div>
      </div>

      {/* enable variations toggle */}
      <div
        className="btn text-white w-100 mb-3"
        style={{ backgroundColor: `var(--grey)` }}
        onClick={handleRemoveDimensions}
      >
        {dimensions.enabled === false ? "Add Variations" : "Remove Variations"}
      </div>

      {/* item Variation Inputs */}
      {dimensions.enabled === false ? (
        ""
      ) : (
        <>
          {/* Main Variation Inputs */}
          <div className="form-floating d-flex flex-row">
            <div className="form-floating w-100">
              <div className="input-group mb-3">
                <input
                  required
                  type="text"
                  className="form-control w-25"
                  placeholder="Type (e.g. Colour)"
                  aria-label="variation type"
                  id="mainType"
                  style={{ fontSize: "10pt" }}
                  value={main.type}
                  onChange={(e) => {
                    setMain({ ...main, type: e.target.value });
                  }}
                  disabled={!dimensions.editing}
                  autoComplete="false"
                />
                <input
                  required
                  type="text"
                  className="form-control w-50"
                  placeholder="Options (e.g. Red, White)"
                  aria-label="variation option"
                  id="mainOptionStockPrice"
                  style={{ fontSize: "10pt" }}
                  value={main.options}
                  onChange={(e) => {
                    setMain({ ...main, options: e.target.value });
                  }}
                  disabled={!dimensions.editing}
                  autoComplete="false"
                />
              </div>
            </div>
          </div>
          {/* Sub Variation Inputs */}
          <div className="form-floating d-flex flex-row">
            <div className="form-floating mb-3 w-100">
              <div className="input-group">
                <input
                  required
                  type="text"
                  className="form-control w-25"
                  placeholder="Sub-Type (e.g. Size)"
                  aria-label="sub-variation type"
                  id="subType"
                  style={{ fontSize: "10pt" }}
                  value={sub.type}
                  onChange={(e) => {
                    setSub({ ...sub, type: e.target.value });
                  }}
                  disabled={!dimensions.editing}
                  autoComplete="false"
                />
                <input
                  required
                  type="text"
                  className="form-control w-50"
                  placeholder="Options (e.g. S, M, L)"
                  aria-label="sub-variation option"
                  id="subOptionStockPrice"
                  style={{ fontSize: "10pt" }}
                  value={sub.options}
                  onChange={(e) => {
                    setSub({ ...sub, options: e.target.value });
                  }}
                  disabled={!dimensions.editing}
                  autoComplete="false"
                />
              </div>
            </div>
          </div>
          {/* (Submit & Edit) (Types & Options) Toggle */}
          <div
            className="btn text-secondary w-100 mb-3 bg-light"
            onClick={handleDimensions}
          >
            {dimensions.editing === true
              ? "Confirm Variations"
              : "Edit Variations"}
          </div>
        </>
      )}

      {/* Variation Price & Stock Inputs */}
      {inventory.showInputTable === false ? (
        ""
      ) : (
        <>
          {/* Input Table */}
          <div className="container border rounded-2 mb-3">
            {/* Table header row */}
            <div className="row border-bottom fw-bold">
              <div className="col border-end text-center">
                {dimensions.main.type[0].toUpperCase() +
                  dimensions.main.type.substring(1)}
              </div>
              {dimensions.sub.type && dimensions.sub.type.length !== 0 ? (
                <div className="col border-end-0 text-center">
                  {dimensions.sub.type[0].toUpperCase() +
                    dimensions.sub.type.substring(1)}
                </div>
              ) : (
                ""
              )}
              <div className="col border-start border-end-0 text-center">
                Price
              </div>
              <div className="col border-start border-end-0 text-center">
                Stock
              </div>
            </div>
            {/* Inventory Units for Price & Stock input */}
            {inventory.units.map((unit, i) => {
              return (
                <div key={i} className="row hover-row">
                  <div className="col border border-top-0 border-start-0 border-end-0 w-25 pt-1 pb-1 ">
                    {unit.mainOption}
                  </div>
                  {unit.subOption && unit.subOption.length !== 0 ? (
                    <div className="col border border-top-0 border-end-0 w-25 pt-1 pb-1 ">
                      {unit.subOption}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="col border border-top-0 w-25 pt-1 pb-1">
                    ${" "}
                    <input
                      disabled={!inventory.editingInputTable}
                      type="number"
                      name="unitPrice"
                      id="unitPrice"
                      value={inventoryHelper[i].price}
                      style={{
                        maxWidth: "50%",
                        border: "1px var(--grey) solid",
                        borderRadius: "5pt",
                      }}
                      onChange={(e) => {
                        let inv = [...inventoryHelper];
                        let item = { ...inv[i], price: e.target.value };
                        inv[i] = item;
                        setInventoryHelper(inv);
                      }}
                    />
                  </div>
                  <div className="col border border-top-0 border-start-0 border-end-0 w-25 pt-1 pb-1">
                    <input
                      disabled={!inventory.editingInputTable}
                      className="ms-2"
                      type="number"
                      name="unitStock"
                      id="unitStock"
                      value={inventoryHelper[i].stock}
                      style={{
                        maxWidth: "50%",
                        border: "1px var(--grey) solid",
                        borderRadius: "5pt",
                      }}
                      onChange={(e) => {
                        let inv = [...inventoryHelper];
                        let item = { ...inv[i], stock: e.target.value };
                        inv[i] = item;
                        setInventoryHelper(inv);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* (Submit & Edit) (Unit Price & Stock) Toggle */}
          <div
            className="btn text-secondary w-100 mb-3 bg-light"
            onClick={handleInventoryPriceStock}
          >
            {inventory.editingInputTable === true
              ? "Confirm Unit Stock & Price"
              : "Edit Unit Stock & Price"}
          </div>
        </>
      )}

      {/* item image uploader */}
      <div className="form-floating mb-1">
        <input
          type="file"
          className="form-control"
          id="image"
          placeholder="~"
          value={fileInputState}
          onChange={handleFileInputChange}
        />
        <label htmlFor="name">
          Click to Choose File <span style={{ color: `var(--grey)` }}>*</span>
        </label>
      </div>
      {previewSource && (
        <div className="mb-3">
          <img src={previewSource} alt="chosen" style={{ height: "100px" }} />
        </div>
      )}

      <div className="modal-footer d-flex flex-row justify-content-between border-0 p-0">
        <div className="text-secondary">{isSaving.message}</div>
        <div>
          <button
            type="button"
            className="btn text-white"
            style={{ backgroundColor: `var(--grey)` }}
            data-bs-dismiss="modal"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            disabled={isSaving.state}
            onClick={handleImage}
            className="btn text-white ms-2"
            style={{ backgroundColor: `var(--green)` }}
          >
            {isSaving.state === true ? (
              <span>
                <span
                  class="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Saving
              </span>
            ) : (
              <>{isSaving.display}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewProductForm;
