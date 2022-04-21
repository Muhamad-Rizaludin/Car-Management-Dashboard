const mongoose      = require('mongoose');
const casrsSchema   = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    size:{
        type:String,
        required:true,
    },
    images:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        required:true,
        default:Date.now,
    },

});

module.exports = mongoose.model("Cars", casrsSchema);