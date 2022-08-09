import React, { useState, useEffect } from "react";
import { categories } from "../data/categories";

/* #region  FilePond imports */
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
/* #endregion */

const NewProductForm = () => {
  const [files, setFiles] = useState([]);
  const initNewItem = {
    name: "",
    description: "",
    category: null,
    price: "",
    stock: "",
    dimension_enabled: false,
    dimension_main: { enabled: false, type: "", options: [] },
    dimension_sub: { enabled: false, type: "", option: [] },
    dimension_inventory: [],
  };
  const [input, setInput] = useState(initNewItem);
  const handleChange = (event) => {
    event.preventDefault();
    const { id, value } = event.target;
    setInput({ ...input, [id]: value });
  };

  const initHelper = { type: "", options: "" };
  const [main, setMain] = useState(initHelper);
  const [sub, setSub] = useState(initHelper);
  const initOptions = { enabled: false, type: "", options: [] };
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
      const mainOptions = main.options.replace(/\s/g, "").split(",");
      if (sub.type.length !== 0) {
        const subOptions = sub.options.replace(/\s/g, "").split(",");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(input);
  };

  return (
    <form>
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

      {/* item category selector */}
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
      <FilePond
        /* #region   */
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={3}
        server="/api"
        name="files"
        imagePreviewHeight={250}
        imagePreviewTransparencyIndicator={`#f00`}
        labelIdle="Drag & Drop Images (Up to 3)"
        credits={{ label: "", url: "" }}
        /* #endregion */
      />
      <div className="modal-footer border-0 p-0">
        <button
          type="button"
          className="btn text-white"
          style={{ backgroundColor: `var(--grey)` }}
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <div
          onClick={handleSubmit}
          className="btn text-white"
          style={{ backgroundColor: `var(--green)` }}
        >
          Save
        </div>
      </div>
    </form>
  );
};

const NewProductModal = () => {
  return (
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
            <button type="button" className="pop btn border-0">
              <i className="bi bi-box-arrow-up-right"></i>
            </button>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <NewProductForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductModal;
