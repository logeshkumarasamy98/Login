const mongoose = require("mongoose");
const { buffer } = require("stream/consumers");

mongoose.connect("mongodb://34.123.197.240:27017/logeshtest")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });

const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const LogInCollection = mongoose.model('LogInCollection', logInSchema);

module.exports = LogInCollection;
