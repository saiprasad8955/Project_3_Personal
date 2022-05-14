const { type } = require("express/lib/response");
const { default: mongoose } = require("mongoose");

const isValidReqBody = (value) => {
    if (Object.getOwnPropertyNames(value).length > 0) return true;
    return false;
  };

const isValid = function (value) {
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "undefined" || value === null) return false;
    return true;
}

const isValid2 = function (value) {
    const dv = /[a-zA-Z]/;
    if (typeof value !== 'string') return false;
    if (dv.test(value) === false) return false;
    return true;
}

const isValidPincode = function (value)  {
    const dv = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/; 
    if(typeof value !== 'string') return false
    if(dv.test(value)=== false) return false
    return true
 }
 const check = (value)=>{
   value.every(i=>typeof i ==="string"); return true
 }

 const isValidObjectId = (objectId) => {
    if (mongoose.Types.ObjectId.isValid(objectId.trim())) return true;
    return false;
  };

module.exports = { 
    isValidReqBody,
    isValid,
    isValid2,
    isValidPincode,
    isValidObjectId,
    check
}