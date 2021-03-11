const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const horseSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    weight: Number,
    age: Number,
    color: {
      type: String,
      required: true
    },
    sex: {
      type: String,
      required: true
    },
    sire: {
      type: String,
      required: true
    },
    dam: {
      type: String,
      required: true
    },
    procedence: String,
    raceDetails: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    stable: mongoose.Schema.Types.ObjectId,
    stats: Object,
    jockeyStats: Object,
    workouts: [mongoose.Schema.Types.ObjectId],
    retirements: [mongoose.Schema.Types.ObjectId],
    bestTimes: Object
  }
)
module.exports = mongoose.model("Horse", horseSchema);