const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const horseRaceDetailSchema = new Schema(
  {
    bet: String,
    claimed: Boolean,
    claimedBy: mongoose.Schema.Types.ObjectId,
    claiming: String,
    comments: String,    
    confirmed: Boolean,
    date: Date,    
    discarded: Boolean,
    distance: Number,
    finalStraightUrl: String,
    finishTime: String,
    horseAge: Number,
    horseEquipments: [String],
    horseMedications: [String],    
    horseWeight: Number,
    jockey: mongoose.Schema.Types.ObjectId,
    jockeyChanged: Boolean,
    jockeyWeight: Number,
    lengths: Object,
    positions: Object,
    raceId: mongoose.Schema.Types.ObjectId,
    raceNumber: Number,
    raceUrl: String,
    retiredDetails: String,
    stable: mongoose.Schema.Types.ObjectId,
    startingPosition: Number,
    statsReady: Boolean,
    status: String,
    times: Object,
    totalHorses: Number,
    trackCondition: String,
    trainer: mongoose.Schema.Types.ObjectId,
    trainingTimes: [
      {
        type: Object
      }
    ]
  })
module.exports = mongoose.model("HorseRaceDetail", horseRaceDetailSchema);