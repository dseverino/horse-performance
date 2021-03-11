const Race = require("../../models/race");
const Program = require("../../models/program");
const { transformRace } = require("./merge")

const HorseRaceDetail = require("../../models/horseRaceDetail");

module.exports = {

  races: async (args, req) => {
    try {
      if (!req.loggedIn) {
        //throw new Error("User not authenticated!")
      }
      //Race.deleteMany().then()
      const races = await Race.find();

      return races.map(race => {
        return transformRace(race)
      })
    }
    catch (err) {
      throw err
    }
  },

  createRace: async (args, req) => {
    /*if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }*/
    const race = new Race(args.raceInput);
    try {
      const raceSaved = await race.save();
      if (raceSaved && raceSaved.programId) {
        //const program = await Program.findOne({ _id: raceSaved.programId })

        //program.races.push(raceSaved._id);
        try {
          await Program.updateOne({ _id: raceSaved.programId }, { $push: { races: raceSaved._id } });
        } catch (error) {
          throw error
        }
      }
      return transformRace(raceSaved)
    }
    catch (err) {
      throw err
    }
  },
  completeRace: async (args) => {
    try {
      const race = await Race.findById(args.raceId)

      if (race) {
        race.completed = true
        await race.save();
        return transformRace(race);
      }
    }
    catch (err) {
      throw err
    }
  },

  deleteRace: async (args) => {
    const result = await Race.findByIdAndRemove(args.raceId)
    return transformRace(result)
  },

  addHorse: async (args) => {
    //(raceId: ID, horseId: ID): Race!
    try {
      const race = await Race.findOneAndUpdate({ _id: args.raceId }, { $push: { horses: args.horseId } }, { new: true })
      return transformRace(race);
    }
    catch (err) {
      throw err
    }
  },

  updateRaceDetails: async (args) => {
    try {
      const race = await Race.update({ _id: args.raceId }, args.raceDetails)

      if (race && race.ok) {
        if (args.retiredHorses.length) {
          await HorseRaceDetail.updateMany({ _id: { $in: args.retiredHorses } }, { $set: { status: "retired" } })
        }
        if (args.raceDetails.raceUrl) {
          await HorseRaceDetail.updateMany({ _id: { $in: args.horseRaceDetailIds } }, { $set: { raceUrl: args.raceDetails.raceUrl, finalStraightUrl: args.raceDetails.finalStraightUrl } })
        }
        return args.raceDetails;
      }
    }
    catch (err) {
      throw err
    }
  },
  loadRace: async (args) => {
    const race = await Race.findById(args.raceId);
    return transformRace(race);
  }

}
