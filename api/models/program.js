const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true
    },
    races: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Race"
      }
    ],
    date: {
      type: Date,
      required: true
    }
  }
)

module.exports = mongoose.model("Program", programSchema);