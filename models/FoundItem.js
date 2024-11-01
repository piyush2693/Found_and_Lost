const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const foundItemSchema = new Schema({
  title: {
    type: String,
    // required: true,
  },
  desc: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  foundBy: {
    type: String,
    // required: true,
  },
  foundDate : {
    type : String,
    // required : true
  },
  foundLocation : {
    type : String,
    // required : true
  },
  founderPhone: {
    type : Number,
    // required : true
  },
  founderRoll_no : {
    type : String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FoundItem = mongoose.model("foundItem", foundItemSchema);
module.exports = FoundItem;
