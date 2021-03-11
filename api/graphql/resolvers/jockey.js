const Jockey = require("../../models/jockey")
const { transformJockey } = require("../resolvers/merge")

module.exports = {
  singleJockey: async (args) => {
    try {
      
      //Horse.remove().then()
      const result = await Jockey.findOne({ name: args.name });
      
      if(result){        
        return transformJockey(result)
      }            
    }
    catch (err) {
      throw err
    }
  },
  createJockey: async (args) => {
    const jockey = new Jockey({
      name: args.jockeyInput.name
    })
    try {
      const result = await jockey.save()
      if (result) {
        return transformJockey(result)
      }
    } catch (error) {
      throw error
    }
  },
  jockeys: async (args) => {
    try {
      const jockeys = await Jockey.find().sort({ name: 1 });
      return jockeys.map(jockey => {
        return transformJockey(jockey)
      })
    } catch (error) {
      throw error
    }   
  }
}