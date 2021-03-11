const Trainer = require("../../models/trainer")
const { transformTrainer } = require("../resolvers/merge")

module.exports = {
  createTrainer: async (args) => {
    const trainer = new Trainer({
      name: args.trainerInput.name
    })
    try {
      const result = await trainer.save()
      if (result) {
        return transformTrainer(result)
      }
    } catch (error) {
      throw error
    }
  },
  trainers: async (args) => {
    try {
      const trainers = await Trainer.find().sort({ name: 1 });
      return trainers.map(trainer => {
        return transformTrainer(trainer)
      })
    } catch (error) {
      throw error
    }   
  },
  singleTrainer: async (args) => {
    try {
      
      const name = new RegExp("^" + args.name + "$", "i");      
      const result = await Trainer.findOne({ name: { $regex: name } });
      
      if(result){        
        return transformTrainer(result)
      }
    }
    catch (err) {
      throw err
    }
  }
}