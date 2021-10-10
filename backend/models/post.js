const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    name: { type: String, required: true },
    weight: { type: Number, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Post", postSchema);
