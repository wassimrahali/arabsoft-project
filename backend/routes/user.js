const express = require("express");
const router = express.Router();
const { getUserById, getUser, createUser, getAllUsers, updateUser, deleteUser, updateUserInfo } = require("../controllers/userController");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/authController");

router.param("userId", getUserById);
router.get("/user/:userId",  getUser);

// CRUD operations on users
router.get("/admin/users",  getAllUsers);
router.put("/admin/user/:userId",updateUserInfo);
router.delete("/admin/user/:userId", deleteUser);

module.exports = router;
