const DataLoader = require("dataloader");

const Horse = require("../../models/horse");
const HorseRaceDetail = require("../../models/horseRaceDetail")
const User = require("../../models/user");
const Race = require("../../models/race");
const Jockey = require("../../models/jockey");
const Stable = require("../../models/stable");
const Trainer = require("../../models/trainer");
const Claiming = require("../../models/claiming");
const Workout = require("../../models/workout");
this.raceId = ""

const horseLoader = new DataLoader((horseIds, raceId) => {  
  return horses(horseIds, raceId)
})

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } })
})

const racesLoader = new DataLoader(raceIds => {
  return races(raceIds)
});

const raceDetailLoader = new DataLoader(raceDetailIds => {
  return raceDetails(raceDetailIds)
})

const jockeyLoader = new DataLoader(jockeyIds => {
  return jockeys(jockeyIds);
})
const stableLoader = new DataLoader(stableIds => {
  return stables(stableIds);
})
const racePositionsLoader = new DataLoader(raceIds => {
  return racePositions(raceIds);
})
const workoutLoader = new DataLoader(workoutIds => {
  return workouts(workoutIds);
})
const trainerLoader = new DataLoader(trainerIds => {
  return trainers(trainerIds);
})

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString())
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdHorses: () => horseLoader.loadMany(user._doc.createdHorses)
    }
  }
  catch (err) {
    throw err
  }
}

const jockey = async jockeyId => {
  try {
    const jockey = await jockeyLoader.load(jockeyId);
    return transformJockey(jockey)
  } catch (error) {
    throw error
  }
}
const jockeys = async jockeyIds => {
  try {
    const results = await Jockey.find({ _id: { $in: jockeyIds } });
    return jockeyIds.map((jockeyId) => results.find((jockey) => jockey._id.toString() === jockeyId.toString()));
  }
  catch (error) {
    throw error
  }
}

const stables = async stableIds => {
  try {   
    const results = await Stable.find({ _id: { $in: stableIds } });
    const filtered = stableIds.map((stableId) => results.find((stable) => stable._id.toString() === stableId.toString() ));    
    return filtered.map(stable => {
      return transformStable(stable);
    })
  } catch (error) {
    throw error
  }
}

const racePositions = async raceIds => {
  try {   
    const results = await Race.find({ _id: { $in: raceIds } }, {positions: 1});
    return raceIds.map((raceId) => results.find((race) => race._id.toString() === raceId.toString() ));    
  } catch (error) {
    throw error
  }
}

const workouts = async workoutIds => {
  try {   
    const results = await Workout.find({ _id: { $in: workoutIds } });
    return workoutIds.map((workoutId) => results.find((workout) => workout._id.toString() === workoutId.toString())).map(workout => {
      return transformWorkout(workout)
    });
  } catch (error) {
    throw error
  }
}

const trainers = async trainerIds => {
  try {    
    const results = await Trainer.find({ _id: { $in: trainerIds } });
    const filtered = trainerIds.map((trainerId) => results.find((trainer) => trainer._id.toString() === trainerId.toString() ));
    return filtered.map(trainer => {
      return transformTrainer(trainer)
    })
  }
  catch (err) {
    throw err
  }
}
const trainer = async trainerId => {
  try {
    const trainer = await trainerLoader.load(trainerId)
    return transformTrainer(trainer)
  } catch (error) {
    throw error
  }
}
const stable = async stableId => {
  try {
    const stable = await stableLoader.load(stableId)
    return transformStable(stable)
  } catch (error) {
    throw error
  }
}

const getRacePositions = async raceId => {
  try {    
    const positions = await racePositionsLoader.load(raceId);
    return positions
  } catch (error) {
    throw error
  }
}

const workout = async wourkoutId => {
  try {
    const workout = await workoutLoader.load(wourkoutId)
    return transformWorkout(workout)
  } catch (error) {
    throw error
  }
}

const singleHorse = async horseId => {
  try {
    const horse = await horseLoader.load(horseId.toString());
    return horse
  }
  catch (err) {
    throw err
  }
}

const races = async raceIds => {
  try {
    const races = await Race.find({ _id: { $in: raceIds } })
    races.sort((a, b) => {
      return (
        raceIds.indexOf(a.event.toString()) - raceIds.indexOf(b.event.toString())
      );
    });
    return races.map(race => {
      return transformRace(race)
    })
  }
  catch (err) {
    throw err
  }
}

const raceDetails = async raceDetailIds => {  
  try {
    const results = await HorseRaceDetail.find({ _id: { $in: raceDetailIds } });    
    return raceDetailIds.map((raceDetailId) => results.find((raceDetail) => raceDetail._id.toString() === raceDetailId.toString())).map(raceDetail => {
      return transformRaceDetail(raceDetail);
    })
  } catch (error) {
    throw error
  }
}

const horses = async (horseIds, raceId) => {
  try {
    const m = { $match: { "_id": { $in: horseIds } } };
    const a = { $addFields: { "__order": { $indexOfArray: [horseIds, "$_id"] } } };
    const s = { $sort: { "__order": 1 } };
    const horses = await Horse.aggregate([m, a, s])//await Horse.find({ _id: { $in: horseIds } });
    
    return horses.map(horse => {
      return transformHorse(horse)
    })
  }
  catch (err) {
    throw err
  }
}

const transformUser = (user) => {
  return {
    ...user._doc,
    _id: user.id,
    password: null,
    createdHorses: () => horseLoader.loadMany(user._doc.createdHorses)
  }
}

const transformHorse = async horse => {
  return {
    ...horse,
    _id: horse._id.toString(),
    name: horse.name,
    weight: horse.weight,
    age: horse.age,
    color: horse.color,
    sex: horse.sex,
    sire: horse.sire,
    dam: horse.dam,
    procedence: horse.procedence,
    stable: () => stableLoader.load(horse.stable) || [],
    raceDetails: raceDetailLoader.loadMany(horse.raceDetails) || [],
    stats: horse.stats,
    jockeyStats: horse.jockeyStats,
    workouts: () => workoutLoader.loadMany(horse.workouts),
    bestTimes: horse.bestTimes || {}
  }
}

const transformRaceDetail = raceDetail => {  
  return {
    ...raceDetail,
    _id: raceDetail.id,
    bet: raceDetail.bet,
    claimed: raceDetail.claimed,
    claimedBy: () => raceDetail.claimedBy ? stable(raceDetail.claimedBy) : null,
    claiming: raceDetail.claiming,
    comments: raceDetail.comments,
    confirmed: raceDetail.confirmed || false,
    date: raceDetail.date.toISOString(),
    discarded: raceDetail.discarded,
    distance: raceDetail.distance,
    finalStraightUrl: raceDetail.finalStraightUrl,
    finishTime: raceDetail.finishTime,
    horseAge: raceDetail.horseAge,
    horseEquipments: raceDetail.horseEquipments.sort(),
    horseMedications: raceDetail.horseMedications.sort((a, b) => (a < b) ? 1 : ((b < a) ? -1 : 0)),
    horseWeight: raceDetail.horseWeight,    
    jockey: () => jockey(raceDetail.jockey),
    jockeyWeight: raceDetail.jockeyWeight,
    jockeyChanged: raceDetail.jockeyChanged,
    lengths: raceDetail.lengths || {start: "", quarterMile: "", halfMile: "", thirdQuarter: "", mile: "", finish: ""},
    positions: raceDetail.positions || {start: 0, quarterMile: 0, halfMile: 0, thirdQuarter: 0, mile: 0, finish: 0},
    raceUrl: raceDetail.raceUrl || "",
    raceId: raceDetail.raceId.toString(),
    raceNumber: raceDetail.raceNumber,
    racePositions: () => getRacePositions(raceDetail.raceId),    
    retiredDetails: raceDetail.retiredDetails,
    stable: () => stable(raceDetail.stable),
    startingPosition: raceDetail.startingPosition,
    statsReady: raceDetail.statsReady,
    status: raceDetail.status,
    times: raceDetail.times || { quarterMile: "0", halfMile: "0", thirdQuarter: "0", mile: "0", finish: "0" },
    totalHorses: raceDetail.totalHorses,
    trackCondition: raceDetail.trackCondition,
    trainer: () => trainer(raceDetail.trainer),
    trainingTimes: raceDetail.trainingTimes
  }
}

const transformProgram = async program => {
  return {
    ...program,
    _id: program.id,
    number: program.number,
    date: program.date,
    races: () => racesLoader.loadMany(program.races)
  }
}

const transformRace = race => {
  return {
    ...race,
    _id: race.id,
    event: race.event,
    date: race.date,
    distance: race.distance,
    claimings: race.claimings,
    claimingType: race.claimingType,
    procedences: race.procedences,
    spec: race.spec,
    horseAge: race.horseAge,
    programId: race.programId,
    purse: race.purse,
    completed: race.completed,
    horses: horseLoader.loadMany(race.horses),
    times: race.times,
    totalHorses: race.totalHorses,
    hasRaceDetails: race.hasRaceDetails,
    trackCondition: race.trackCondition,
    positions: race.positions,
    raceUrl: race.raceUrl,
    finalStraightUrl: race.finalStraightUrl
  }
}

const transformJockey = jockey => {  
  return {
    ...jockey,
    _id: jockey.id,
    name: jockey.name,
    stats: jockey.stats,
    trainerStats: jockey.trainerStats
  }
}

const transformTrainer = trainer => {
  return {
    ...trainer,
    _id: trainer._id.toString(),
    name: trainer.name,
    stats: trainer.stats
  }
}

const transformStable = stable => {
  return {
    _id: stable._id.toString(),
    name: stable.name,
    trainers: () => trainerLoader.loadMany(stable.trainers),
    horses: () => horseLoader.loadMany(stable.horses),
    stats: stable.stats
  }
}

const transformRacePositions = race => {
  return {
    _id: stable._id.toString(),
    name: stable.name,
    trainers: () => trainerLoader.loadMany(stable.trainers),
    horses: () => horseLoader.loadMany(stable.horses),
    stats: stable.stats
  }
}

const transformClaiming = claiming => {
  return {
    _id: claiming._id.toString(),
    date: claiming.date,
    claimedBy: () => stableLoader.load(claiming.claimedBy),
    claimedFrom: () => stableLoader.load(claiming.claimedFrom),
    price: claiming.price
  }
}

const transformWorkout = workout => {
  return {
    _id: workout.id.toString(),
    date: workout.date,      
    horse: () => horseLoader.load(workout.horse),    
    distance: workout.distance,
    jockey: () => jockey(workout.jockey),
    type: workout.type,
    time: workout.time,
    trackCondition: workout.trackCondition    
  }
}

exports.transformProgram = transformProgram
exports.transformHorse = transformHorse
exports.transformUser = transformUser
exports.transformRace = transformRace
exports.transformJockey = transformJockey
exports.transformRaceDetail = transformRaceDetail
exports.transformStable = transformStable
exports.transformTrainer = transformTrainer
exports.transformClaiming = transformClaiming
exports.transformWorkout = transformWorkout