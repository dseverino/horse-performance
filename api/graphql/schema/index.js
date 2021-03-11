const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Program {
    _id: ID!
    number: Int!
    date: String!
    races: [Race!]
  }

  type Claiming {
    _id: ID!
    date: String!
    horse: ID
    claimedBy: ID
    claimedFrom: ID
    price: Int
  }
  input ClaimingInput {
    date: String!
    horse: ID
    claimedBy: ID
    claimedFrom: ID
    price: Int
  }

  type Race {
    _id: ID!
    programId: ID!
    event: Int!
    date: String!
    distance: Int!
    claimings: [String!]!
    procedences: [String!]!
    horseAge: String!
    spec: String
    purse: String
    completed: Boolean
    horses: [Horse]
    times: Time
    totalHorses: Int
    hasRaceDetails: Boolean
    trackCondition: String
    positions: [RacePositions]
    raceUrl: String
    finalStraightUrl: String
  }
  input RaceInput {
    programId: ID!
    event: Int!
    date: String!
    distance: Int!
    claimings: [String!]!
    procedences: [String!]!
    horseAge: String!
    spec: String
    purse: Int!
    times: TimeInput
    totalHorses: Int
    hasRaceDetails: Boolean
    trackCondition: String
  }

  input RaceDetailsInput {
    times: TimeInput
    totalHorses: Int
    hasRaceDetails: Boolean
    trackCondition: String
    positions: [RacePositions]
    raceUrl: String
    finalStraightUrl: String
  }

  type Horse {
    _id: ID!
    name: String!
    weight: Int
    age: Int!
    color: String!
    sex: String!
    sire: String!
    dam: String!
    procedence: String!
    raceDetails: [HorseRaceDetail]
    stable: Stable
    stats: Stats
    jockeyStats: Stats
    workouts: [Workout]
    bestTimes: BestTimes
  }

  type HorseRaceDetail {
    _id: ID!    
    claimed: Boolean
    claimedBy: Stable
    comments: String
    confirmed: Boolean
    startingPosition: Int    
    claiming: String
    horseMedications: [String] 
    horseEquipments: [String]    
    jockey: Jockey
    jockeyWeight: Int
    jockeyChanged: Boolean
    stable: Stable
    trainer: Trainer
    date: String
    raceNumber: Int
    trackCondition: String
    distance: Int
    positions: Position
    lengths: Length
    bet: String
    trainingTimes: [TrainingTime]
    horseWeight: Int        
    retiredDetails: String
    totalHorses: Int
    discarded: Boolean
    horseAge: Int
    times: Time
    finalStraightUrl: String
    finishTime: String    
    raceId: ID
    racePositions: RacePositions
    raceUrl: String
    statsReady: Boolean
    status: String
  }

  type Position {
    start: Int 
    quarterMile: Int
    halfMile: Int
    thirdQuarter: Int
    mile: Int
    finish: Int
  }

  type Length {
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }
  type Time {
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }

  type TrainingTime {
    date: String
    time: String
    jockey: String 
    effort: String
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdHorses: [Horse!]
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }
  scalar Stats
  scalar SelectedHorse
  scalar RacePositions
  scalar BestTimes

  type Jockey {
    _id: ID!
    name: String!
    stats: Stats
    trainerStats: Stats
  }
  type Stable {
    _id: ID
    name: String
    horses: [Horse]
    trainers: [Trainer]
    stats: Stats
  }
  type Trainer {
    _id: ID!
    name: String!
    stats: Stats
  }

  input PositionInput {
    start: Int
    quarterMile: Int
    halfMile: Int
    thirdQuarter: Int
    mile: Int
    finish: Int
  }
  input LengthInput {
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }
  input TimeInput {
    quarterMile: String
    halfMile: String
    thirdQuarter: String
    mile: String
    finish: String
  }
  input TrainingTimeInput {
    date: String
    time: String
    jockey: String 
    effort: String
  }

  input HorseInput {
    name: String!
    weight: Int
    age: Int!
    color: String!
    sex: String!
    sire: String!
    dam: String!
    procedence: String!
    stable: ID
    bestTimes: BestTimes
  }

  input HorseRaceDetailInput {
    bet: String
    claimed: Boolean 
    claimedBy: ID
    comments: String
    confirmed: Boolean
    date: String
    distance: Int
    jockey: ID 
    jockeyWeight: Int
    jockeyChanged: Boolean
    trainer: ID
    stable: ID
    startingPosition: Int    
    lengths: LengthInput
    times: TimeInput
    finishTime: String
    trainingTimes: [TrainingTimeInput] 
    horseWeight: Int    
    claiming: String
    trackCondition: String
    raceNumber: Int
    status: String 
    retiredDetails: String
    horseEquipments: [String]
    horseMedications: [String]
    positions: PositionInput
    totalHorses: Int 
    discarded: Boolean
    horseAge: Int    
    raceId: ID
    statsReady: Boolean
    horseId: ID
  }

  input ProgramInput {
    number: Int!
    date: String!
  }

  input UserInput {
    email: String
    password: String
  }
  input JockeyInput {
    name: String!
  }
  input TrainerInput {
    name: String!
  }
  input StableInput {
    name: String!
  }

  input WorkoutInput {
    date: String
    horse: ID
    distance: String
    jockey: ID
    type: String
    time: String
    trackCondition: String
    workoutUrl: String
  }

  type Workout {
    _id: ID!
    date: String
    horse: Horse
    distance: String
    jockey: Jockey
    type: String
    time: String
    trackCondition: String
    workoutUrl: String
  }

  type RootQuery {
    horses: [Horse!]!
    horse(name: String): [Horse]
    horsesWithoutStable: [Horse]!    
    singleProgram(date: String): Program
    singleHorse(id: ID!): Horse
    searchHorse(name: String): Horse
    singleJockey(name: String!): Jockey
    singleStable(name: String!): Stable
    singleTrainer(name: String!): Trainer
    users: [User!]!
    programs: [Program!]!
    loadRace(raceId: ID): Race!
    races: [Race!]!
    login(email: String!, password: String!): AuthData!    
    jockeys: [Jockey!]!
    stables: [Stable!]!
    stablesWithoutTrainer: [Stable]
    trainers: [Trainer!]!
    horseRaceDetails: [HorseRaceDetail]
  }

  type RootMutation {
    addHorse(raceId: ID, horseId: ID): Race!
    addHorseStable(horseId: ID, stableId: ID): Horse
    addRaceDetail(raceDetailId: ID, horseId: ID): Horse
    addTrainerStable(stableId: ID, trainerId: ID): Stable
    addRace(programId: String, raceId: String): Program!
    completeRace(raceId: ID): Race!
    createClaiming(claimingInput: ClaimingInput) : Claiming
    createStable(stableInput: StableInput): Stable
    createTrainer(trainerInput: TrainerInput): Trainer    
    createWorkout(workoutInput: WorkoutInput): Workout
    createHorse(horseInput: HorseInput): Horse
    createHorseRaceDetail(horseRaceDetail: HorseRaceDetailInput, horseId: ID): HorseRaceDetail
    createJockey(jockeyInput: JockeyInput): Jockey
    createProgram(programInput: ProgramInput): Program!
    createRace(raceInput: RaceInput): Race!
    createUser(userInput: UserInput) : User    
    deleteRace(raceId: String): Race!    
    updateHorseRaceDetail(selectedHorse: SelectedHorse): HorseRaceDetail
    updateRaceDetails(raceId: ID, raceDetails: RaceDetailsInput, retiredHorses: [ID], horseRaceDetailIds: [ID]): Race
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)