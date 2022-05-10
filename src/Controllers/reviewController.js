const bookModel = require("../models/bookModel");
const validator = require("../validator/validator")


const createReview = async(req,res)=>{
    try{
    // extract bookID from Path parms
    let bookID = req.params.bookId;

    // store request Body in REQBODy
    let reqBody = req.body;

    /// Check data is coming or not
    if (!validator.isValidReqBody(reqBody)) {
        return res.status(400).send({ status: false, message: "Please Enter Review Details" })
    }

    // Object Destructing
    let {bookId,  reviewedBy, rating, review, isDeleted} = reqBody;

    // Check BookID is coming or not 
    if (!validator.isValid(bookId)) {
        return res.status(400).send({ status: false, message: "Book ID is Required Writing Review" })
    }

    // Valid BookID
    if (!validator.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "Book ID is Not Valid" })
    }

    // Check Book is present or not
    const bookPresent = await bookModel.findOne({ _id:bookID, isDeleted:false })
    if(!bookPresent){
        return res.status(400).send({ status: false, message: "Book is Not Present" })
    }

    // Check reviewedBy is Coming or not 
    if(! validator.isValid(reviewedBy)){
        return res.status(400).send({ status: false, message: "Please Enter Reviewer's Name" })
    }

    // Validate ReviewedBy
    if(! validator.isValid2(reviewedBy)){
        return res.status(400).send({ status: false, message: "Please Enter Valid Reviewer's Name" })
    }

    // Check reviewedBy is Coming or not 
    if(! validator.isValid(rating)){
        return res.status(400).send({ status: false, message: "Please Enter Ratings" })
    }

    // Validate the rating
    if(!(rating >= 1 && rating <= 5 )){
        return res.status(400).send({ status: false, message: "Invalid Ratings!! Ratings Should be From 1 to 5" })
    }

    // Check review is Coming Or not
    if(! validator.isValid(review)){
        return res.status(400).send({ status: false, message: "Please Enter the Review" })
    }

    // Validate the review
    if(! validator.isValid2(review)){
        return res.status(400).send({ status: false, message: "Please Enter a Valid Review" })
    }

    // Set Current Time And Date for Reviwed At
    let reviewedAt = new Date().toISOString();

    // Check if isDeleted is True
    if(isDeleted === true){
        return res.status(400).send({ status: false, message: "No data should be deleted At the time of Creation" })
    }

    // Finally Create the Review 
}
catch(err)
{
    return res.status(500).send({ status: false, message : err.message})
}

}
const updateReview = async(req,res)=>{
    //

}
const deleteReview = async(req,res)=>{
    //

}

module.exports={createReview, updateReview, deleteReview}