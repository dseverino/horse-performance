const programResolver = require("../resolvers/program");
const raceResolver = require("../resolvers/race")
const horseResolver = require("../resolvers/horse");
const jockeyResolver = require("../resolvers/jockey")
const horseRaceDetail = require("../resolvers/horseRaceDetail")
const stableResolver = require("../resolvers/stable");
const trainerResolver = require("../resolvers/trainer")
const claimingResolver = require("../resolvers/claiming")
const workoutResolver = require("../resolvers/workout");

module.exports = {
  ...horseResolver,
  ...programResolver,
  ...raceResolver,
  ...jockeyResolver,
  ...horseRaceDetail,
  ...stableResolver,
  ...trainerResolver,
  ...claimingResolver,
  ...workoutResolver
}