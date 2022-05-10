const { default: mongoose } = require('mongoose');
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const validator = require("../validator/validators")



const createBook = async (req, res) => {

    try {
        // Extract body 
        const reqBody = req.body;

        // Object Destructing
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt, reviews,isDeleted
        } = reqBody;

        // Check data is coming or not
        if (! validator.isValidReqBody(reqBody)) {
            return res.status(400).send({ status: false, message: "Please Enter the All Book Details" })
        }

        
        if (! validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is Required' });
        }

        if (! validator.isValid2(title)) {
            return res.status(400).send({ status: false, message: 'Please Enter Valid title' });
        }

        const duplicateTitle = await bookModel.findOne({ title: title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "Title is Already presents" })
        }


        if (! validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, message: 'Please Enter the Excerpt' });
        }

        if (! validator.isValid2(excerpt)) {
            return res.status(400).send({ status: false, message: 'Please enter valid excerpt' });
        }

        if (! validator.isValid(userId)) {
            return res.status(400).send({ status: false, message: 'userId is Required' });
        }

        if (! validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Please enter valid user ID' });
        }

        // Check Duplicate UserId
        const duplicateUserId = await userModel.findOne({ userId: userId });
        if (! duplicateUserId) {
            return res.status(400).send({ status: true, message: "User ID is Not exists in our Database" })
        }

        if (! validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, message: 'ISBN is Required' });
        }

        let reISBN = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
        if (! reISBN.test(ISBN)){
            return res.status(400).send({ status: false, message: 'Please Enter a Valid ISBN' });
        }


        // Check duplicate ISBN
        const duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
        if (duplicateISBN) {
            return res.status(400).send({ status: true, message: "ISBN is already exist" })
        }

        if (! validator.isValid(category)) {
            return res.status(400).send({ status: false, message: 'category is Required' });
        }

        if ( !validator.isValid2(category)) {
            return res.status(400).send({ status: false, message: 'Please Enter a Valid Category' });
        }

        if (! validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: 'subcategory is Required' });
        }

        if (! validator.check(subcategory)) {
            return res.status(400).send({ status: false, message: 'Enter Valid Subcategory' });
        }

        if (! validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: 'Please Enter Released Date' });
        }

        let reAt = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;// YYYY-MM-DD
        if (! reAt.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "Released Date Format Should be in 'YYYY-MM-DD' Format " });
        }

        if(address.street && !validator.isValid2(address.street)){
            res.status(400).send({status: false , message: 'Enter a valid Street'})
            return
        }

        if(address.city && !validator.isValid2(address.city)){
            res.status(400).send({status: false , message: 'Enter a valid city name'})
            return
        }

        if(address.pincode && !validator.isValidPincode(address.pincode)){
            res.status(400).send({status: false , message: 'Enter a valid city pincode'})
            return
        }

        if (reviews && (typeof reviews !== 'number')) {
            return res.status(400).send({ status: false, message: "Reviews Must be numbers" })
        }

        if(isDeleted === true){
            return res.status(400).send({ status: false, message: "No Data Should Be Deleted At The Time Of Creation" })
        }
        const bookDetails = await bookModel.create(reqBody)
        return res.status(201).send({ status: true, message: 'successfully created ', data: { bookDetails } })
        // Create 10 books
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
};



const getAllBooks = async (req, res) => {

    try {
        
        // Extract body 
        const reqQuery = req.query;

        // Object Destructing 
        const { userId, category, subcategory} = reqQuery;

        // If no queries Are Provided then fetch all the book data
        if ( Object.keys(reqQuery).length == 0) {
            const bookData = await bookModel.find({ isDeleted: false}).sort({title: 1}).select({ _id: 1, title: 1, excerpt: 1, subcategory:1, userId: 1, category: 1, releasedAt: 1})
            if(! bookData){ 
                 return res.status(404).send({ status: false, message: 'Books Not Found' });
            }
            return res.status(200).send({ status: true,  message: 'Books Lists', data: { bookData } })
        }

        if ( userId && ! validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Please enter Valid User ID' });
        }

        if ( category && ! validator.isValid2(category)) {
            return res.status(400).send({ status: false, message: 'Please Enter a Valid Category' });
        }

        if ( subcategory && ! validator.check(subcategory)) {
            return res.status(400).send({ status: false, message: 'Subcategory is Required' });
        }

       // If the Queries are coming then Find the Data by Queries
        if ( reqQuery ) {
            let bookData = await bookModel.find({
                 isDeleted: false, 
                 $or: [{ userId: userId }, { category: category }, { subcategory: subcategory }]})
                .sort({ title: 1 })
                .select({ _id: 1, title: 1, excerpt: 1, userId: 1,  subcategory:1, category: 1, releasedAt: 1, reviews: 1 })
            if (! bookData) {
                return res.status(404).send({ status: false, message: 'Books Not Found With these Filters' });
            }
            return res.status(200).send({ status: true, message: 'Book Lists', data: { bookData } })
        }

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.msg })
    }

}


module.exports = { createBook, getAllBooks }