const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact_number: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    country_name: {
        type: String,
        required: true,
    },
    orgnization_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})