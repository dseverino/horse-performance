const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema(
  {
    date: String,      
    horse: mongoose.Schema.Types.ObjectId,    
    distance: String,
    jockey: mongoose.Schema.Types.ObjectId,
    type: String,
    time: String,
    trackCondition: String,
    workoutUrl: String
  }
)
module.exports = mongoose.model("Workout", workoutSchema);