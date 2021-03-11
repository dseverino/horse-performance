const Claiming = require("../../models/claiming");

const { transformClaiming } = require("./merge");


module.exports = {
  singleClaiming: async (args) => {
    try {
      const claiming = await Claiming.findOne({ name: args.name }).collation({ locale: "en", strength: 1 });

      if (claiming) {
        return transformClaiming(claiming);
      }
    }
    catch (err) {
      throw err
    }
  },

  claimings: async () => {
    try {
      //Claiming.remove().then()
      const claimings = await Claiming.find().sort({ name: 1 })
      return claimings.map(claiming => {        
        return transformClaiming(claiming)
      })
    }
    catch (err) {
      throw err
    }
  },

  createClaiming: async (args, req) => {
    const newClaiming = new Claiming(args.claimingInput);
    try {
      const result = await newClaiming.save();
      let createdClaiming = await transformClaiming(result);
      return createdClaiming;
    }
    catch (err) {
      throw err;
    }
  }
}