const HorseRaceDetail = require("../../models/horseRaceDetail");
const Horse = require("../../models/horse");
const Stable = require('../../models/stable');
const { transformRaceDetail } = require("../resolvers/merge")
const Claiming = require("../../models/claiming");
const Retirement = require('../../models/retirement');
const Jockey = require('../../models/jockey');
const Trainer = require('../../models/trainer');
const Race = require("../../models/race");

module.exports = {

  createHorseRaceDetail: async (args, req) => {
    /*if (!req.loggedIn) {
      throw new Error("User not authenticated!")
    }*/
    const horseRaceDetail = new HorseRaceDetail(args.horseRaceDetail)
    try {
      const raceDetail = await horseRaceDetail.save();
      if (raceDetail) {
        //const horse = await Horse.findById(args.horseId)
        //if (horse) {
          //Uncomment later to update horse weight if different than actual
          //if (horse.weight != args.horseRaceDetail.horseWeight) {
            //horse.weight = args.horseRaceDetail.horseWeight;
          //}

          await Horse.updateOne({ _id: args.horseId }, { $push: { raceDetails: horseRaceDetail.id } })
          
        //}
      }
      return transformRaceDetail(raceDetail);
    }
    catch (err) {
      throw err
    }
  },

  horseRaceDetails: async () => {
    try {
      const raceDetails = await HorseRaceDetail.find();
      return raceDetails.map(raceDetail => {
        return transformRaceDetail(raceDetail)
      })
    } catch (error) {
      throw error
    }
  },

  updateHorseRaceDetail: async (args) => {
    const horseId = args.selectedHorse.horseId;
    const horseName = args.selectedHorse.name
    delete args.selectedHorse.horseId;
    delete args.selectedHorse.name

    try {
      const raceDetail = await HorseRaceDetail.update({ _id: args.selectedHorse._id }, args.selectedHorse);
      if (raceDetail && raceDetail.ok) {
        if (args.selectedHorse.claimed) {

          await Horse.updateOne({ _id: horseId }, { $set: { stable: args.selectedHorse.claimedBy } });

          await Stable.updateOne({ _id: args.selectedHorse.stable }, { $pull: { horses: horseId } });
          await Stable.updateOne({ _id: args.selectedHorse.claimedBy }, { $push: { horses: horseId } });

          const claim = new Claiming({ ...args.selectedHorse, claimedFrom: args.selectedHorse.stable, price: parseInt(args.selectedHorse.claiming.split(" ")[0].replace(/,/g, '')), horse: horseId });
          try {
            const result = await claim.save();
            if (result) {
              console.log(result)
            }
          } catch (error) {
            console.log(error)
          }
        }

        if (args.selectedHorse.status === "retired") {

          const retired = new Retirement({ date: new Date(args.selectedHorse.date), raceId: args.selectedHorse.raceId, horse: horseId, reason: args.selectedHorse.comments });

          try {
            const result = await retired.save();
            if (result) {
              await Horse.updateOne( { _id: horseId }, { $push: { retirements: result._id } } );
              return args.selectedHorse;
            }
          } catch (error) {
            console.log(error)
          }
        }

        let pos = ['starts', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth']
        var myObj = {};

        if (args.selectedHorse.positions.finish > 0) {

          //myObj['position'] = args.selectedHorse.positions.finish
          myObj['name'] = horseName
          myObj[`by`] = args.selectedHorse.byLengths.finish
          
          var ob = {}
          ob[`positions.${args.selectedHorse.positions.finish - 1}`] = myObj
          
          const race = await Race.update({ _id: args.selectedHorse.raceId }, { $set: ob });
          ob = {}
          ob[`bestTimes.${args.selectedHorse.distance}`] = args.selectedHorse.finishTime
          
          if(!args.selectedHorse.bestTime || args.selectedHorse.bestTime > args.selectedHorse.finishTime){
            await Horse.updateOne({ _id: horseId }, { $set: ob });
          }          
        }

        if (args.selectedHorse.positions.finish > 0 && !args.selectedHorse.statsReady) {

          let year = new Date(args.selectedHorse.date).getFullYear();
          myObj = {};
          myObj[`stats.${year}.starts`] = 1;
          myObj[`stats.${year}.${pos[args.selectedHorse.positions.finish]}`] = 1;
          myObj[`trainerStats.${year}.${args.selectedHorse.trainer}.starts`] = 1
          myObj[`trainerStats.${year}.${args.selectedHorse.trainer}.${pos[args.selectedHorse.positions.finish]}`] = 1;
          try {
            await Jockey.updateOne({ _id: args.selectedHorse.jockey }, { $inc: myObj })
          } catch (error) {
            console.log(error)
          }
          try {
            myObj = {}
            myObj[`stats.${year}.starts`] = 1;
            myObj[`stats.${year}.${pos[args.selectedHorse.positions.finish]}`] = 1;
            await Stable.updateOne({ _id: args.selectedHorse.stable }, { $inc: myObj })
            await Trainer.updateOne({ _id: args.selectedHorse.trainer }, { $inc: myObj })

            myObj = {}
            myObj[`stats.${year}.starts`] = 1;
            myObj[`stats.${year}.${pos[args.selectedHorse.positions.finish]}`] = 1;
            myObj[`jockeyStats.${year}.${args.selectedHorse.jockey}.starts`] = 1
            myObj[`jockeyStats.${year}.${args.selectedHorse.jockey}.${pos[args.selectedHorse.positions.finish]}`] = 1;
            await Horse.updateOne({ _id: horseId }, { $inc: myObj });

            await HorseRaceDetail.update({ _id: args.selectedHorse._id }, { $set: { statsReady: true } });

          } catch (error) {
            console.log(error)
          }
        }

        return args.selectedHorse;
      }
    } catch (error) {
      throw error
    }
  }


}
