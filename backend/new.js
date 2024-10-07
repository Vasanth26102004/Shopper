const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { console } = require("inspector");

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://vasanthp2610:vasanth2610@cluster0.h1wtv.mongodb.net/eCommerse"
);

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Create Upload Destination
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for Product
const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    new_price: {
      type: Number,
      required: true,
    },
    old_price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    available: {
      type: Boolean,
      default: true,
    },
  })
);

//Add Product
app.post("/addproduct", async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product = products[products.length - 1];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    const product = new Product({ ...req.body, id });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});

//Remove Product
app.post("/removeproduct", async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({
      success: true,
      name: req.body.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
});

//Get All Product
app.get("/allproduct", async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("All Products Found");
    res.send(products);
    console.log(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error getting products" });
  }
});

//Schema for Users
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Endpoint for Email register
app.post("/signup", async (req, res) => {
  const check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "User was Found with an Existing Email Address",
    });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  let user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom", { expiresIn: "30s" });
  res.json({ success: true, token, user });
});

//Endpoint for Email login
app.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, errors: "No User Found with this Email Adress" });
  }
  const isValidPassword = req.body.password === user.password;
  if (!isValidPassword) {
    return res.status(400).json({ success: false, errors: "Invalid Password" });
  }
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom", { expiresIn: "30s" });
  res.status(201).json({
    success: true,
    token,
    user,
  });
});

//Endpoint for newCollection
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("new collection fetched");
  res.send(newcollection);
});

//Endpoint fo Popular in Women
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in Women fetched");
  res.send(popular_in_women);
});


// JWT Middleware
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ errors: "Authentication token missing" });
  try {
    const decoded = jwt.verify(token, "secret_ecom");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ errors: "Invalid or expired token" });
  }
};

// Cart Operations
app.post("/addtocart", fetchUser, async (req, res) => {
  const { itemId } = req.body;
  const user = await Users.findById(req.user.id);
  user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;
  await user.save();
  res.json({ success: true, message: "Item added to cart" });
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  const { itemId } = req.body;
  const user = await Users.findOneAndUpdate(req.user.id);
  if (user.cartData[itemId] > 0) {
    user.cartData[itemId] -= 1;
    await user.save();
    res.json({ success: true, message: "Item removed from cart" });
  } else {
    res.json({ success: false, message: "Item not in cart or quantity is zero" });
  }
});

app.get("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findOneAndUpdate(req.user.id);
  res.json({ success: true, cartData: user.cartData });
});

//Server Port
app.listen(port, (error) => {
  if (!error) console.log("Server Running on Port:" + port);
  else console.log("Error : " + error);
});
