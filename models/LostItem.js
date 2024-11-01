const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lostItemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  owner: {
    type: String,
    required: true,
  },
  lostDate : {
    type : String,
  },
  lostLocation : {
    type : String
  },
  ownerPhone : {
    type : String
  },
  ownerRoll_no : {
    type : String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const LostItem = mongoose.model("lostItem", lostItemSchema);
module.exports = LostItem;
