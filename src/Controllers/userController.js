const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("../validator/validator")

// Register User
const register = async(req, res) => {
    try {
        // Extract data from RequestBody
        const requestBody = req.body;

        // Object Destructing
        const { title, name, phone, email, password,address } = requestBody

        // Validation Starts
        // first Check body is coming or not 

        if( ! validator.isValidReqBody(requestBody)){
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
        }

        // Check Title is coming or not 
        if (! validator.isValid(title)) {
            return res.status(400).send({ status: true, msg: "Please Enter the Title" })
        }

        // Validate the title of author
        if (! ["Mr", "Mrs", "Miss"].includes(title)) {
            return res.status(400).send({ status: false, msg: "Title Must be of these values [Mr, Mrs, Miss] " });
        }

        // Check Name is coming or not
        if (! validator.isValid(name)) {
            return res.status(400).send({ status: true, msg: "Please Enter User Name" })
        }

        // Check Name coming is valid or not 
        if (! validator.isValid2(name)) {
            return res.status(400).send({ status: true, msg: ` Entered ${name} is Not a Valid Name` })
        }

        // Check Phone Number is coming or not
        if (! validator.isValid(phone)) {
            return res.status(400).send({ status: true, msg: "Please Enter Phone Number" })
        }

        // Validate the Phone Number
        let dv = /^([+]\d{2}[ ])?\d{10}$/;
        if (! dv.test(phone)) {
            return res.status(400).send({ status: true, msg: ` Entered ${phone} is Not a Valid Phone Number` })
        }

        // Check Duplicate Phone Number
        const DuplicateNumber = await userModel.findOne({ phone: phone });
        if (DuplicateNumber !== null) {
            return res.status(400).send({ status: true, msg: "Entered Phone Number is Already Registered" })
        }

        // Check Email is Coming or not 
        if (! validator.isValid(email)) {
            return res.status(400).send({ status: true, msg: "Please Enter Email" })
        }

        // Validate Email
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (! re.test(email)) {
            return res.status(400).send({ status: true, msg: "Please Enter Valid Email" })
        }

        // Check Duplicate Email 
        const DuplicateEmail = await userModel.findOne({ email: email });
        if (DuplicateEmail !== null) {
            return res.status(400).send({ status: true, msg: " Entered Email Address is Already registered" })
        }

        // Check Password is Coming Or not 
        if (! validator.isValid(password)) {
            return res.status(400).send({ status: true, msg: "Please Enter Password" })
        }

        // Validate Password 
        const passRE = /^(?!\S*\s)(?=\D*\d)(?=.*[!@#$%^&*])(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z]).{8,15}$/;
        if (! passRE.test(password)) {
            return res.status(400).send({ status: true, msg: "Please Enter Valid Password" })
        }
        
        // Validate street 
        if(address.street && !validator.isValid2(address.street)){
        return res.status(400).send({status: false , message: 'Enter a valid Street'})
        }

        // Validate city
        if(address.city && !validator.isValid2(address.city)){
        return res.status(400).send({status: false , message: 'Enter a valid city name'})
        }

        // Validate pincode
        if(address.pincode && !validator.isValidPincode(address.pincode)){
        return res.status(400).send({status: false , message: 'Enter a valid city pincode'})
        }


        // Finally Create The User Details After Validation
        const User = await userModel.create(requestBody);
        return res.status(201).send({ status: true, msg: "User Created Successfully", data: User })
        // create 5 authors
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.msg })
    }

};

// User Login 
const login = async (req,res)=>{
    try{

        // RequestBody from body
        const requestBody = req.body;
        // Extract Email And Password
        const {email,password } = requestBody;

        // Check data is coming or not
        if(! validator.isValidReqBody(requestBody)){
        return res.status(400).send({ status: false, msg: "Please Enter Email and Password" })
        }

        // Check Email is Coming Or not 
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(! re.test(email)){
        return res.status(400).send({ status: false, msg: "Please Enter the Email" })
        }

        // Check Email is Present 
        const user = await userModel.findOne({email: email, password: password}) 
        console.log(user)
        if(! user){
        return res.status(400).send({ status: false, msg: "Entered Email or Password is Not Registered" })
        }

        // Check Password
        if(! validator.isValid(password)){
        return res.status(400).send({ status: false, msg: "Please Enter the Password" })
        }


        // Generate Token 
        const token = jwt.sign({ userId: user._id.toString()}, "Book-Management", {expiresIn:"10h"});

        // Send the token to Response Header
        res.setHeader("x-api-key", token);

        // send response to  user that Author is successfully logged in
        return res.status(200).send({status: true, message: "Author login successfully", data: { token }});

    }catch(err){
        return res.status(500).send({ status: false, msg: err.msg })
    }
}

module.exports = { register, login };