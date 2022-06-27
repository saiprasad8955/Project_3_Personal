const jwt =require("jsonwebtoken")

const authentication = async function(req,res,next){


    try{

    // take token from client 
    let token = req.headers["x-Api-key"]

    if( token == undefined ) { token= req.headers["x-api-key"] }

    //If no token is present in the request header return error
    if (!token) return res.status(401).send({ status: false, msg: "Token must be present" });

    // Callback function for decodedtoken 
    let token = function (err, token) {
        if (err) {
          return res.status(400).send({status:false, msg:"Invalid Token!!!!"});
        }
        else { return token }
      }
  
      //if token is present then decode the token
      let decodedToken = jwt.verify(token, "Book-Management",token)

    req.decodedToken = decodedToken 
    // if Everything is ok then we head towards Api's
    next();

}
catch(err){
    return res.status(401).send({ status: false, err : "Token is Invalid" })
}
};


module.exports={ authentication }