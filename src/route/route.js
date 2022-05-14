const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const bookController = require("../Controllers/bookController");
const reviewController = require("../Controllers/reviewController");
const mw = require("../middleware/middleware");

//-----------------------------USER API's
router.post("/registerUser",userController.register);
router.post("/login",userController.login);

//-----------------------------BOOK API's
// PROTECTED ROUTES
router.post("/books", mw.authentication, bookController.createBook);
router.get("/books", /*mw.authentication,*/ bookController.getAllBooks);
router.get("/book/:bookId", /*mw.authentication,*/ bookController.getById);
router.put("/books/:bookId", /*mw.authentication,*/ bookController.updateById);
router.delete("/books/:bookId", /*mw.authentication,*/ bookController.deletedById);

//-----------------------------REVIEW API's
// PROTECTED ROUTED
router.post("/books/:bookId/review",  reviewController.createReview);
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);


module.exports =  router ;