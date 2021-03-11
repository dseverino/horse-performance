const Workout = require("../../models/workout")
const Horse = require("../../models/horse");
const { transformWorkout } = require("../resolvers/merge")

module.exports = {
  createWorkout: async (args) => {
    const workout = new Workout(args.workoutInput)
    try {
      const result = await workout.save()
      if (result) {
        const horse = await Horse.updateOne( { _id: args.workoutInput.horse }, { $push: { workouts: result._id } } );
        return transformWorkout(result)
      }
    } catch (error) {
      throw error
    }
  },
  workouts: async (args) => {
    try {
      const workouts = await Workout.find()
      return workouts.map(workout => {
        return transformWorkout(workout)
      })
    } catch (error) {
      throw error
    }
  },
  singleWorkout: async (args) => {
    try {

      const name = new RegExp("^" + args.name + "$", "i");
      const result = await Workout.findOne({ name: { $regex: name } });

      if (result) {
        return transformWorkout(result)
      }
    }
    catch (err) {
      throw err
    }
  }
}