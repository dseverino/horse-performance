const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const raceSchema = new Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program"
    },
    event: Number,
    date: Date,
    distance: Number,
    claimings: [
      {
        type: String,
        required: true
      }
    ],
    procedences: [
      {
        type: String,
        required: true
      }
    ],
    spec: String,
    horseAge: String,
    purse: Number,
    completed: Boolean,
    horses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Horse"
      }
    ],
    times: Object,
    totalHorses: Number,
    hasRaceDetails: Boolean,
    trackCondition: String,
    positions: Object,
    raceUrl: String,
    finalStraightUrl: String
  }
)

module.exports = mongoose.model("Race", raceSchema);