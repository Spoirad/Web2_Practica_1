const mongoose = require("mongoose")
const userScheme = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true  //obliga que el email sea unico en base de datos.
    },
    password:{
        type: String, 
        required: true
    },
    role:{
        type: ["user", "admin"], 
        default: "user"
    },
    codigo: {
        type: Number,
        default: 0  

    },
    status: {
        type: Boolean, 
        default: false
    },
    attemps: {
        type: Number,
        default: 0
    },
    },

    {
        timestamps: true, 
        versionKey: false
    }
)

module.exports = mongoose.model("users", userScheme) 