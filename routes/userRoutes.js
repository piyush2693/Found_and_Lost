const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const passport = require("./../auth/auth");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const uploadOnCloudinary = require("./../utils/cloudinary");
const FoundItem = require("./../models/FoundItem");
const LostItem = require("./../models/LostItem");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "././uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/lost/upload", upload.array("images", 5), async (req, res) => {
    let { title, desc, lostDate, lostLocation,owner, ownerPhone, ownerRoll_no } = req.body;
  
    let imageURLs = [];
  
    try {
      // Check if images were uploaded
      if (req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }
  
      // Upload each image to Cloudinary
      const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
  
      // Extract URLs and delete local files
      uploadResults.forEach(result => {
        if (result) {
          imageURLs.push(result.url);
        }
      });
  
      // Clean up local file storage after upload
      req.files.forEach(file => fs.unlinkSync(file.path));
  
      // Create a new found item with the uploaded images
      const lostItem = new LostItem({
        title,
        desc,
        images: imageURLs, // Assign uploaded image URLs
        owner,
        lostDate,
        lostLocation,
        ownerPhone,
        ownerRoll_no
      });
      await lostItem.save();
      const foundList = await FoundItem.find();
      const lostList = await LostItem.find();
      res.render("home", { foundList, lostList });
  
    } catch (error) {
      console.error("Error during file upload or save:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  });

router.post("/found/upload", upload.array("images", 5), async (req, res) => {
    let { title, desc, foundBy, foundDate, foundLocation, founderPhone, founderRoll_no } = req.body;
  
    let imageURLs = [];
  
    try {
      // Check if images were uploaded
      if (req.files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }
  
      // Upload each image to Cloudinary
      const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
      const uploadResults = await Promise.all(uploadPromises);
  
      // Extract URLs and delete local files
      uploadResults.forEach(result => {
        if (result) {
          imageURLs.push(result.url);
        }
      });
  
      // Clean up local file storage after upload
      req.files.forEach(file => fs.unlinkSync(file.path));
  
      // Create a new found item with the uploaded images
      const foundItem = new FoundItem({
        title,
        desc,
        images: imageURLs, // Assign uploaded image URLs
        foundBy,
        foundDate,
        foundLocation,
        founderPhone,
        founderRoll_no
      });
      const response =  await foundItem.save();
      const dateOnly = response.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
  
      const foundList = await FoundItem.find();
      const lostList = await LostItem.find();
      // const lostList = null;
      res.render("home", { foundList, lostList });

    // res.render('home');
  
    } catch (error) {
      console.error("Error during file upload or save:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  });


// Passport authentication middleware
router.get("/signUp", (req, res) => {
  res.render("signUp.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Sign Up Route
router.post("/signUp", async (req, res) => {
  const { email, password, name, roll_no } = req.body; // Extract user data from request body
  console.log(name, " ", email);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send("User with this email already exists.");
  }

  try {
    const newUser = new User({
      email,
      password,
      name,
      roll_no,
    });

    await newUser.save();
    res.redirect("./../");
  } catch (error) {
    console.error("Error adding user: ", error);
    res.status(500).send("Error adding user: " + error.message);
  }
});

const localAuthMiddleware = passport.authenticate("user-local", {
  session: false,
});

// Login Route
router.post("/login", localAuthMiddleware, async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Invalid credentials");
    }
    try {
      const foundList = await FoundItem.find();
      const lostList = await LostItem.find();
      // const lostList = null;
      res.render("home", { foundList, lostList });
    } catch (error) {
      console.error("Error fetching found or lost items:", error); // Log error
      res.status(500).send("An error occurred while fetching items"); // Status code for server error
    }
  });





  

router.get("/found", (req, res) => {
  res.render("found.ejs");
});

router.get("/lost", (req, res) => {
  res.render("lost.ejs");
});

router.get("/home", async (req, res) => {
    try {
      const foundList = await FoundItem.find();
      const lostList = await LostItem.find();
      res.render("home", { foundList, lostList });
    } catch (error) {
      console.error("Error fetching found or lost items:", error);
      res.status(500).json({ message: "An error occurred while fetching items" });
    }
  });

  router.get("/foundList", async(req,res) => {
    try {
      const foundList = await FoundItem.find();
      const lostList = [];
      res.render("home", { foundList, lostList });
    } catch (error) {
      console.error("Error fetching found or lost items:", error);
      res.status(500).json({ message: "An error occurred while fetching items" });
    }
  });
  router.get("/lostList", async(req,res) => {
    try {
      const lostList = await LostItem.find();
      const foundList = [];
      res.render("home", { foundList, lostList });
    } catch (error) {
      console.error("Error fetching found or lost items:", error);
      res.status(500).json({ message: "An error occurred while fetching items" });
    }
  });


  router.get('/filterItems', async (req, res) => {
    const { dateFilter } = req.query;
    let foundList = await FoundItem.find();
    let lostList = await LostItem.find();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    if (dateFilter === 'today') {
        foundList = foundList.filter(item => new Date(item.createdAt).toDateString() === today.toDateString());
        lostList = lostList.filter(item => new Date(item.createdAt).toDateString() === today.toDateString());
    } else if (dateFilter === 'yesterday') {
        foundList = foundList.filter(item => new Date(item.createdAt).toDateString() === yesterday.toDateString());
        lostList = lostList.filter(item => new Date(item.createdAt).toDateString() === yesterday.toDateString());
    } else if (dateFilter === 'lastWeek') {
        foundList = foundList.filter(item => {
            const createdAt = new Date(item.createdAt);
            return createdAt >= lastWeek && createdAt <= today;
        });
        lostList = lostList.filter(item => {
            const createdAt = new Date(item.createdAt);
            return createdAt >= lastWeek && createdAt <= today;
        });
    }

    res.render('home', { foundList, lostList }); // Update 'yourView' to your actual view name
});


module.exports = router;
