const jwt =require("jsonwebtoken")

const authentication = async function(req,res,next){


    try{

    // take token from client 
    let token = req.headers["x-Api-key"]

    if( token == undefined ) { token= req.headers["x-api-key"] }

    //If no token is present in the request header return error
    if (!token) return res.status(401).send({ status: false, msg: "Token must be present" });

    //if token is present then decode the token
    let decodedToken = jwt.verify(token,"Book-Management")
    
    // Check Decoded token is here or not
    if(!decodedToken) return res.status(401).send({ status : false, msg : "Token is Not Present"})

    req.decodedToken = decodedToken 
    // if Everything is ok then we head towards Api's
    next();

}
catch(err){
    return res.status(401).send({ status: false, err : "Token is Invalid" })
}
};


module.exports={ authentication }