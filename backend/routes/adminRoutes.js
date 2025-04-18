const express = require("express");
const User = require("../model/User"); // Import the User model
const { protect, admin } = require("../middleware/authMiddleware"); // Import the protect and admin middleware

const router = express.Router();

// @route GET api/admin/users
// @desc Get all users (admin only)
// @access Private (admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users from the database
    res.status(200).json(users); // Send the users as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST api/admin/users
// @desc Add a new user (admin only)
// @access Private (admin only)
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body; // Destructure the request body

  try {
    let user = await User.findOne({ email }); // Check if the user already exists
    if (user) {
      return res.status(400).json({ message: "User already exists" }); // If user exists, send an error response
    }

    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT api/admin/users/:id
// @desc Update a user info - Name, email and role (admin only)
// @access Private (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE api/admin/users/:id
// @desc Delete a user (admin only)
// @access Private (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
