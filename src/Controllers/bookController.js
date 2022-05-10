const { default: mongoose } = require('mongoose');
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const reviewModel = require('../models/reviewModel');
const validator = require("../validator/validator")



const createBook = async (req, res) => {

  try {

    // Extract body 
    const reqBody = req.body;

    // Check data is coming or not
    if (!validator.isValidReqBody(reqBody)) {
      return res.status(400).send({ status: false, message: "Please Enter the All Book Details" })
    }

    // Object Destructing
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, reviews, isDeleted } = reqBody;

    if (!validator.isValid(title)) {
      return res.status(400).send({ status: false, message: 'Title is Required' });
    }

    if (!validator.isValid2(title)) {
      return res.status(400).send({ status: false, message: 'Please Enter Valid title' });
    }

    const duplicateTitle = await bookModel.findOne({ title: title })
    if (duplicateTitle) {
      return res.status(400).send({ status: false, message: "Title is Already presents" })
    }


    if (!validator.isValid(excerpt)) {
      return res.status(400).send({ status: false, message: 'Please Enter the Excerpt' });
    }

    if (!validator.isValid2(excerpt)) {
      return res.status(400).send({ status: false, message: 'Please enter valid excerpt' });
    }

    if (!validator.isValid(userId)) {
      return res.status(400).send({ status: false, message: 'userId is Required' });
    }

    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: 'Please enter valid user ID' });
    }

    // Check UserId Exists or not
    const UserId = await userModel.findOne({ userId: userId });
    if (!UserId) {
      return res.status(400).send({ status: true, message: "User ID is Not exists in our Database" })
    }

    if (!validator.isValid(ISBN)) {
      return res.status(400).send({ status: false, message: 'ISBN is Required' });
    }

    let reISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    if (!reISBN.test(ISBN)) {
      return res.status(400).send({ status: false, message: 'Please Enter a Valid ISBN' });
    }

    // Check duplicate ISBN
    const duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
    if (duplicateISBN) {
      return res.status(400).send({ status: true, message: "ISBN is already exist" })
    }

    if (!validator.isValid(category)) {
      return res.status(400).send({ status: false, message: 'category is Required' });
    }

    if (!validator.isValid2(category)) {
      return res.status(400).send({ status: false, message: 'Please Enter a Valid Category' });
    }

    if (!validator.isValid(subcategory)) {
      return res.status(400).send({ status: false, message: 'subcategory is Required' });
    }

    if (!validator.check(subcategory)) {
      return res.status(400).send({ status: false, message: 'Enter Valid Subcategory' });
    }

    //    subcategory = validator.removeWhiteSpcAndEmpStr(subcategory);

    if (!validator.isValid(releasedAt)) {
      return res.status(400).send({ status: false, message: 'Please Enter Released Date' });
    }

    let reAt = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;// YYYY-MM-DD
    if (!reAt.test(releasedAt)) {
      return res.status(400).send({ status: false, message: "Released Date Format Should be in 'YYYY-MM-DD' Format " });
    }

    if (reviews && (typeof reviews !== 'number')) {
      return res.status(400).send({ status: false, message: "Reviews Must be numbers" })
    }

    if (isDeleted === true) {
      return res.status(400).send({ status: false, message: "No Data Should Be Deleted At The Time Of Creation" })
    }
    const bookDetails = await bookModel.create(reqBody)
    return res.status(201).send({ status: true, message: 'successfully created ', data: bookDetails })
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
};

const getAllBooks = async (req, res) => {

  try {

    // Extract body 
    const reqQuery = req.query;

    // Object Destructing 
    const { userId, category, subcategory } = reqQuery;

    // If no queries Are Provided then fetch all the book data
    if (Object.keys(reqQuery).length == 0) {
      const bookData = await bookModel.find({ isDeleted: false }).sort({ title: 1 }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
      if (!bookData) {
        return res.status(404).send({ status: false, message: 'Books Not Found' });
      }
      return res.status(200).send({ status: true, message: 'Books Lists', data: { bookData } })
    }

    if (userId && !validator.isValidObjectId(userId.trim())) {
      return res.status(400).send({ status: false, message: 'Please enter Valid User ID' });
    }

    if (category && !validator.isValid2(category.trim())) {
      return res.status(400).send({ status: false, message: 'Please Enter a Valid Category' });
    }
    /////////////////////////////////////////////////////////////////////////////
    if (subcategory && !validator.check(subcategory)) {
      return res.status(400).send({ status: false, message: 'Subcategory is Required' });
    }

    // If the Queries are coming then Find the Data by Queries
    if (reqQuery) {
      let bookData = await bookModel.find({
        isDeleted: false,
        $or: [{ userId: userId }, { category: category }, { subcategory: subcategory }]
      })
        .sort({ title: 1 })
        .select({ _id: 1, title: 1, excerpt: 1, userId: 1, subcategory: 1, category: 1, releasedAt: 1, reviews: 1 })
      if (!bookData) {
        return res.status(404).send({ status: false, message: 'Books Not Found With these Filters' });
      }
      return res.status(200).send({ status: true, message: 'Book Lists', data: bookData })
    }

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.msg })
  }

}

const getById = async (req, res) => {
  try {

    const bookId = req.params.bookId;

    // Valid BookId
    if (!validator.isValidObjectId(bookId)) {
      return res.status(404).send({ status: false, message: 'book Id is not valid' });
    }

    // Find Bookdata in Bookmodel
    let bookData = await bookModel.findOne({ isDeleted: false, _id: bookId });

    // IF book exists then check for reviews
    if (bookData) {
    let reviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

    // Store review Length As count from reviews Data
    let reviewCount = reviews.length
    
    // if review count is > 0 then send response
    if ( reviewCount > 0) {

      // Set Reviews Count in BookData's reviews key
      
      bookData.reviews = reviewCount
      return res.status(200).send({status: true, message: 'Boolist', data: { ...bookData.toObject(), reviewData: reviews }})

    }else{

      // Send the Empty array provided by find 
      return res.status(200).send({status: true, message: 'Booklist', data: { ...bookData.toObject(), reviewData: reviews }})

    }
  }else{
  return res.status(404).send({ status: false, message: "Book not found" })
  }
    
  } catch(err) {
  return res.status(500).send({ status: false, msg: err.msg });
  }
};

const updateById = async (req, res) => {
  try {
    // Extract bookId from params
    const bookId = req.params.bookId;

    // Validate the Book ID
    if (! validator.isValidObjectId(bookId)) {
      return res.status(404).send({ status: false, message: 'book Id is not valid' });
    }

    // Extracting request Body
    const reqBody = req.body;

    // Check data is coming or not
    if (!validator.isValidReqBody(reqBody)) {
      return res.status(400).send({ status: false, message: 'Please Enter the All Book Details' });
    }
    
    // Object Destructing
    const { title, excerpt, ISBN, releasedAt } = reqBody;

    // If wrong key present for updation
    if(!(title || excerpt || ISBN || releasedAt)){
      return res.status(400).send({ status: false, message: 'Wrong key Present Please enter correct updation keys' });
    }

    // check TITLE is coming then Validate it
    if (title && ! validator.isValid2(title)) {
      return res.status(400).send({ status: false, message: 'Please Enter Valid title' });
    }

    // Check for duplicate title is not being updated
    const duplicateTitle = await bookModel.findOne({title : title});
    if (duplicateTitle) {
      return res.status(400).send({ status: false, message: 'Title is Already presents try with another title.', });
    }

    // check EXCERPT is coming then Validate it
    if (excerpt && ! validator.isValid2(excerpt)) {
      return res.status(400).send({ status: false, message: 'Please enter valid excerpt' });
    }

    // check ISBN is coming then Validate it
    let reISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
    if (ISBN && ! reISBN.test(ISBN.trim())) {
      return res.status(400).send({ status: false, message: 'Please Enter a Valid ISBN' });
    }

    // Check duplicate ISBN
    const duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
    if (duplicateISBN) {
      return res.status(400).send({ status: true, message: 'ISBN is already exist' });
    }

    // if released is coming then validate it
    let reAt = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // YYYY-MM-DD
    if (releasedAt && ! reAt.test(releasedAt)) {
      return res.status(400).send({
        status: false,
        message: "Released Date Format Should be in 'YYYY-MM-DD' Format ",
      });
    }

    // Update the book by queries
    let query ={ _id: bookId, isDeleted : false} 
    let updatedBook = await bookModel.findOneAndUpdate(
      query,
      { $set : reqBody/*{ $or: [{ title: title }, { excerpt: excerpt }, { releasedAt: releasedAt }, { ISBN: ISBN }]}*/ },
      { new: true }
    );

    console.log(updatedBook);
    // if updated book not found then send error
    if (! updatedBook) {
      return res.status(404).send({ status: false, message: 'Book Data not found.' });
    }

    // finally success done
    return res.status(200).send({ status: true, message: "success", data: updatedBook });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.msg });
  }
};

const  deletedById = async(req,res)=>{
  try {
    
    // Extract Book ID from path parma
    let bookID = req.params.bookId
    
    // VAlidate the BOOK ID
    if (!validator.isValidObjectId(bookID)) {
        return res.status(400).send({ status: false, message: "Book id is not valid" })
    }

    // Find Book in database
    let filter = {_id:bookID, isDeleted:false}
    const book = await bookModel.findOne({filter})
    // console.log(book);

    // IF book not found then send error
    if (! book) {
        return res.status(404).send({ status: false, message: 'Book not found' })
    }

    // Check book is already deleted or not
    if (book.isDeleted === true) {
      return res.status(404).send({ status: false, message: 'Book is Already Deleted' })
    }

    // Delete the book by ID 
    const deletedBook = await bookModel.findOneAndUpdate(
      { _id: bookID }, 
      { isDeleted: true, deletedAt: new Date().toISOString() });

  
    // Book successfully deleted now send a response  
    return res.status(200).send({status:true, msg:"Book Deleted Successfully"})

} catch (error) {
    res.status(500).send({ status: false, message: error.message })
}
};

module.exports = { createBook, getAllBooks, getById, updateById, deletedById }