const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const bookController = require("../Controllers/bookController");
const reviewController = require("../Controllers/reviewController");

//-----------------------------USER API's
router.post("/registerUser",userController.register);
router.post("/login",userController.login);

//-----------------------------BOOK API's
// PROTECTED ROUTES
router.post("/books",bookController.createBook);
router.get("/books",bookController.getAllBooks);
router.get("/books/:bookId",bookController.getById);
router.put("/books/:bookId",bookController.updateById);
router.delete("/books/:bookId",bookController.deletedById);

//-----------------------------REVIEW API's
// PROTECTED ROUTED
router.get("/books/:bookId/review",reviewController.createReview);
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview);









module.exports =  router ;