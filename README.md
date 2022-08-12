# GOMA

### Spin-up Info:

- `npm run liveauth` : starts AuthServer
- `npm run live`: starts database
- `npm start`: starts React instance

### Gallery

User Sign-Up (+Validation) & Login
![User Sign-Up & Login](https://imgur.com/a/kOwBnhl)

Seller Create & Update Listing
![Create & Update Listings](https://imgur.com/j4LfAKy)

Multi-tier Custom Item Variations
![Multi-tier Variations](https://imgur.com/9uPfjrb)

Listing Deletion
![Delete](https://imgur.com/sv5kAdD)

### Technologies & User Story

**MERN Stack + Bootstrap + Cloudinary**

- Other technologies tested/ explored:
  - CMS: Sanity.io
  - File input concepts & utilities: Blobs/Buffers, Filepond, Base64 encoding, Multer & Multi-part forms

**Core User Story: Listing creation experience of e-Commerce Sellers**

- **Motivation**: forms explored so far in the course have been relatively simple, wanted to explore more complex state management. Modifying the form structure to accommodate more complicated user needs, formatting that data so that it's easily writable to DB & then re-populating the form with retrieved data was very challenging and fulfilling because it required a lot of data structure manipulation.

#### Obstacles & Problem-Solving Strategies

**1. Image Upload + Storage in DB**

Uploading, Storing and Updating images to/in DB was quite challenging and my troubleshooting process had several iterations (+ is still ongoing). Earlier approaches largely involved trying to store the Base64 encoded image directly in the DB, but image optimization was a major issue.

Iteration #1: Filepond Uploader (has lots of features but struggled to interpret/ read the file data)
Iteration #2: Multer + native [input = type: file] (image optimization was poor)
Iteration #3 (Current): Native [input = type: file] & Cloudinary SDK (Convenient url generation + cloud storage + image optimization)

To do: Attempt to integrate Filepond Uploader & Cloudinary approach. Will require Promise chaining because Cloudinary's SDK/API only support single file uploads.

Additional bug: currently the write listing to DB API always fails on the 1st try, likely due to Cloudinary integration, but haven't been able to isolate the root cause.

```javascript
//Image File Handler in NewProductForm.js (pre-submit)
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

// Create new item route in ItemRouter.js
router.put("/items", auth, async (req, res) => {
  try {
    const fileStr = req.body.image;
    const uploadRes = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "dev_setups",
    });
    // could probably refactor the below as new Item({...req.body, image: uploadRes.secure_url})
    const createdItem = new Item({
      category: req.body.category,
      subCategory: req.body.subCategory,
      description: req.body.description,
      dimension_enabled: req.body.dimension_enabled,
      dimension_main: req.body.dimension_main,
      dimension_sub: req.body.dimension_sub,
      dimension_inventory: req.body.dimension_inventory,
      image: uploadRes.secure_url,
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      seller_id: req.body.seller_id,
      seller_name: req.body.seller_name,
    });
    await createdItem.save();
    res.status(200).send({ status: 201, message: "Listing created" });
  } catch (error) {
    res.send({ message: error });
  }
});
```

**2. Conditional Rendering in Listing Form (Custom Variations)**

Managing form state was quite challenging due to the competing requirements of input control and the need for dynamically generated input fields. Setting up the state so that it could be easily reversed for populating fields with data fetched from DB was also quite difficult.

![Image](https://imgur.com/0ICae7a)

The solution that ended up working the best was the use of lots of helper states (i.e. set a state then use a hook to update the primary state/ set the primary state on some button click later). It was also helpful to break down the individual fields with more complex interaction and handle the state for these separately, before bundling it all together at the end.
