const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        
    }
})

const categoryModule = mongoose.model("categories", categorySchema);
module.exports = categoryModule; 