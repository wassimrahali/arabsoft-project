const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    detail: {
        type: String,
        required: true,
    },
    image: {
        type: [String], // Assuming images are stored as file paths
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
