const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const validator = require("../validator/validator")


// Create Review
const createReview = async(req,res)=>{
    try{
    // extract bookID from Path parms
    let bookID = req.params.bookId;

    // Valid BookID
    if (!validator.isValidObjectId(bookID)) {
        return res.status(400).send({ status: false, message: "Book ID is Not Valid" })
    }

    // store request Body in REQBODy
    let reqBody = req.body;

    /// Check data is coming or not
    if (!validator.isValidReqBody(reqBody)) {
        return res.status(400).send({ status: false, message: "Please Enter Review Details" })
    }

    // Object Destructing
    let { reviewedBy, rating, review, isDeleted} = reqBody;

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

    // Validate the review
    if ( review &&  ! validator.isValid2(review)){
        return res.status(400).send({ status: false, message: "Please Enter a Valid Review" })
    }

    // Set Current Time And Date for Reviwed At
    let reviewedAt = new Date().toISOString();

    // Check if isDeleted is True
    if(isDeleted === true){
        return res.status(400).send({ status: false, message: "No data should be deleted At the time of Creation" })
    }

    
    // Finally Create the new Review Data 
    const data = { reviewedBy, reviewedAt, rating, review }

    // Add bookID into review 
    data.bookId = bookID;

    let newReview = await reviewModel.create(data);
    
    // Now We have Update the review count in book
    
    // First Check review Count or inc by 1 
    let CheckReviewCount = await reviewModel.find({ bookId: bookID, isDeleted: false }).count()

    // Then Update the Review Count
    let updatedCount = await bookModel.findOneAndUpdate(
        {_id: bookID, isDeleted:false},
        {$set : { review: CheckReviewCount }},
        {new:true})


    // use Spread operator for adding new key     
    const{...data1} =  updatedCount
    // console.log(data1);

    // Add key reviewsData which we have founded above    // Removes unwanted keys

    data1._doc.reviewsData = newReview;

    // Then Simply send the data in response
    return res.status(201).send({status:true, msg: "Review Submitted Successfully", data: data1._doc })

}
catch(err)
{
    return res.status(500).send({ status: false, message : err.message})
}

};

// Update the Review
const updateReview = async(req,res)=>{
      try{
    // extract bookID from Path parms
    let bookID = req.params.bookId;
    let reviewID = req.params.reviewId;

     // Check BookID is coming or not 
     if (!validator.isValid(bookID)) {
        return res.status(400).send({ status: false, message: "Book ID is Required Writing Review" })
    }

    // Valid BookID
    if (!validator.isValidObjectId(bookID)) {
        return res.status(400).send({ status: false, message: "Book ID is Not Valid" })
    }

    // Check reviewID is coming or not 
    if (!validator.isValid(reviewID)) {
        return res.status(400).send({ status: false, message: "Review ID is Required Writing Review" })
    }

    // Valid reviewID
    if (!validator.isValidObjectId(reviewID)) {
        return res.status(400).send({ status: false, message: "Review ID is Not Valid" })
    }

    // store request Body in REQBODy
    let reqBody = req.body;

    /// Check data is coming or not
    if (!validator.isValidReqBody(reqBody)) {
        return res.status(400).send({ status: false, message: "Please Enter Review Details for updating" })
    }

    // Object Destructing
    let { review, rating, reviewedBy} = reqBody;

   
    const reviews = await reviewModel.findOne({ bookId : bookID, isDeleted:false })
  

   if((reviews.bookId).toString() !== bookID ){
    return res.status(400).send({ status: false, message: "You can't update reviews by another book ID !! please enter correct book ID" })
   }


    // Check reviewedBy is Coming or not 
    if(! validator.isValid(reviewedBy)){
        return res.status(400).send({ status: false, message: "Please Enter Reviewer's Name" })
    }

    // Validate ReviewedBy
    if(! validator.isValid2(reviewedBy)){
        return res.status(400).send({ status: false, message: "Please Enter Valid Reviewer's Name" })
    }

    // Check rating is Coming or not 
    if(! validator.isValid(rating)){
        return res.status(400).send({ status: false, message: "Please Enter Ratings" })
    }

    // Validate only number should be come
    if( typeof rating !== "number" ){
        return res.status(400).send({ status: false, message: "Invalid Ratings!! Ratings Should be Number" })
    }

    // Validate the rating
    if(! (rating >= 1 && rating <= 5 ) ){
        return res.status(400).send({ status: false, message: "Invalid Ratings!! Ratings Should be From 1 to 5" })
    }

    // Validate the review
    if( review && ! validator.isValid2(review) ){
        return res.status(400).send({ status: false, message: "Please Enter a Valid Review" })
    }

    let updateReview = await reviewModel.findOneAndUpdate({_id : reviewID, isDeleted:false}, reqBody,{new:true});
    
    if(! updateReview ){
        return res.status(400).send({ status: false, message: "Review is already deleted" })
    }
   
    let bookUpdate = await bookModel.findById(bookID)
    
    const {...data} = bookUpdate;


    data._doc.reviewsData = updateReview 

    return res.status(201).send({status:true, msg: "Review Updated Successfully", data: data._doc })

}
catch(err)
{
 return res.status(500).send({ status: false, message : err.message})
}

}; 

// Delete Review
const deleteReview = async(req,res)=>{
    try{
        // extract bookID from Path parms
        let bookID = req.params.bookId;
        let reviewID = req.params.reviewId;
    
         // Check BookID is coming or not 
         if (!validator.isValid(bookID)) {
            return res.status(400).send({ status: false, message: "Book ID is Required Writing Review" })
        }
    
        // Valid BookID
        if (!validator.isValidObjectId(bookID)) {
            return res.status(400).send({ status: false, message: "Book ID is Not Valid" })
        }

         let bookExist = await bookModel.findById(bookID)

         if (!bookExist) {
            return res.status(400).send({ status: false, message: "Book not Exist with this ID" })
        }
    
        // Check reviewID is coming or not 
        if (!validator.isValid(reviewID)) {
            return res.status(400).send({ status: false, message: "Review ID is Required Writing Review" })
        }
    
        // Valid reviewID
        if (!validator.isValidObjectId(reviewID)) {
            return res.status(400).send({ status: false, message: "Review ID is Not Valid" })
        }

        let reviewExist = await reviewModel.findById(reviewID)

        if (!reviewExist) {
           return res.status(400).send({ status: false, message: "Review not exist with this review ID" })
       }

       if((reviewExist.bookId).toString() !==  bookID){
        return res.status(400).send({ status: false, message: "You can't update reviews by another book ID !! please enter correct book ID" })
       }

       let deleteReview = await reviewModel.findOneAndUpdate({_id: reviewID , isDeleted :false} ,{isDeleted : true},{new : true})

       if(! deleteReview){
        return res.status(400).send({ status: false, message: "Review is already deleted" })
       }

       let reviewCount = await reviewModel.findOne({isDeleted : false , bookId:bookID}).count()

       let updatedReviewBook = await bookModel.findByIdAndUpdate(bookID,{review : reviewCount},{new:true});

       const {...data1} = updatedReviewBook;

       data1._doc.DeletedReviewsData = deleteReview;

      return res.status(200).send({status:true , message:"Review Successfully Deleted" , data : data1._doc})
    }
    catch(err)
    {
     return res.status(500).send({ status: false, message : err.message})
    }

};

module.exports = { createReview, updateReview, deleteReview }