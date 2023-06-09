const mongoose = require("mongoose");
require('dotenv').config();
const uri = process.env.URI
const connect = () => {
    mongoose.connect(uri)
        .then(() => console.log("Database connected"))
        .catch((err) => console.log(err));
}
module.exports = connect;