const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const bookController = require("../Controllers/bookController");

router.post("/registerUser",userController.register);
router.post("/login",userController.login);
router.post("/registerBook",bookController.createBook);
router.get("/books",bookController.getAllBooks);












module.exports =  router ;