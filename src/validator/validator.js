const { default: mongoose } = require("mongoose");

const isValidReqBody = (value) => {
    if (Object.keys(value).length > 0) return true;
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

const isValidPincode = function(value) {
    const dv = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/; 
    if(typeof value !== 'string') return false
    if(dv.test(value)=== false) return false
    return true
 }

 const isValidObjectId = (objectId) => {
    if (mongoose.Types.ObjectId.isValid(objectId)) return true;
    return false;
  };

 const check = (value)=>{
    return value.every(ele => typeof(ele) === "string")
}

// const removeWhiteSpcAndEmpStr = (subArr) => {
//     if (Array.isArray(subArr)) {
//         let arr=[];
//         for (let i = 0; i < subArr.length; i++) {
//                 if(subArr[i].trim().length>0)
//             arr.push(subArr[i].toLowerCase().trim())
//         }
//         return [...arr];
//     }
// }


module.exports={ 
    isValidReqBody,
    isValid,
    isValid2,
    isValidPincode,
    isValidObjectId,
    check
    
}