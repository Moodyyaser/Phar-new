const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    amount: { type: Number, default: 1 },
    price: { type: Number, required: true },
    total: { type: Number, default: 0 }
});

module.exports = mongoose.model("Element", postSchema);
