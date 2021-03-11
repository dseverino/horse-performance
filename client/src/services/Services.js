export const saveStable = name => {
  const requestBody = {
    query: `
      mutation CreateStable($stable: StableInput) {
        createStable(stableInput: $stable) {
          _id
          name
          trainers {
            _id
            name
          }
        }
      }
    `,
    variables: {
      stable: { name }
    }
  }

  return fetch("api/graphql", {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(result => {
      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed")
      }
      return result.json()
    })
    .then(resData => {
      return resData.data.createStable;
    })
    .catch(error => {
      console.log(error);
      setIsLoading(false);
    })
}

export const loadHorses = name => {
  const requestBody = {
    query: `
      query Horse($name: String){
        horse(name: $name) {
          _id
          name
          weight
          age
          color
          sex
          sire
          dam
          raceDetails{
            date
            horseEquipments
            horseMedications
            jockey {
              _id
              name
            }
          }
          stable {         
            _id
            name
            trainers {
              _id
              name
            }
          }            
        }
      }
    `,
    variables: {
      name
    }
  }

  return fetch("api/graphql", {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

export const saveHorse = async (horse) => {

  const requestBody = {
    query: `
      mutation CreateHorse($horse: HorseInput) {
        createHorse(horseInput: $horse) {
          _id
          name
          weight
          age
          color
          sex
          sire
          dam
          procedence
          raceDetails{
            _id
          }
          stable {
            _id
            name
            trainers {
              _id
              name
            }
          }
        }
      }
    `,
    variables: {
      horse: horse
    }
  }

  try {
    const result = await fetch("api/graphql", {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (result.status !== 200 && result.status !== 201) {
      throw new Error("Failed")
    }
    const resData = await result.json()
    return resData.data.createHorse
  } catch (error) {
    console.log(error)
  }
}

export const saveJockey = (name) => {
  const requestBody = {
    query: `
      mutation CreateJockey($jockey: JockeyInput) {
        createJockey(jockeyInput: $jockey) {
          _id
          name
        }
      }
    `,
    variables: {
      jockey: { name }
    }
  }



  return fetch("api/graphql", {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(result => {
      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed")
      }
      return result.json()
    })
    .then(resData => {
      return resData.data.createJockey
    })
    .catch(error => {
      console.log(error);
    })
}

export const saveTrainer = name => {
  const requestBody = {
    query: `
      mutation CreateTrainer($trainer: TrainerInput) {
        createTrainer(trainerInput: $trainer) {
          _id
          name
        }
      }
    `,
    variables: {
      trainer: { name }
    }
  }

  return fetch("api/graphql", {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(result => {
      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed")
      }
      return result.json()
    })
    .then(resData => {
      return resData.data.CreateTrainer;
    })
    .catch(error => {
      console.log(error);
    })
}

export const loadRace = id => {
  const requestBody = {
    query: `
      query LoadRace($raceId: ID){
        loadRace(raceId: $raceId) {
          _id
          event
          distance
          claimings
          procedences
          horseAge
          completed
          spec
          purse
          times {
            quarterMile
            halfMile
            thirdQuarter
            mile
            finish
          }
          totalHorses
          hasRaceDetails
          trackCondition              
          horses {
            _id
            name
            weight
            age
            color
            sex
            sire
            dam
            stable {         
              _id
              name
              stats
            }
            stats
            jockeyStats
            workouts {
              date
              jockey {
                name
              }
              time
              distance
              type
              trackCondition
            }
            bestTimes
            raceDetails {
              _id                  
              claiming
              date
              discarded
              distance
              times {                    
                quarterMile
                halfMile
                thirdQuarter
                mile
                finish
              }
              finishTime
              horseMedications
              horseEquipments
              jockey{
                _id
                name
                stats
                trainerStats
              } 
              jockeyWeight
              jockeyChanged
              stable {
                name
                _id
                stats
              }
              trainer {
                name
                _id
                stats
              }                  
              raceNumber
              racePositions
              trackCondition                  
              startingPosition
              positions{
                start
                quarterMile
                halfMile
                thirdQuarter
                mile
                finish
              }
              lengths{
                quarterMile
                halfMile
                thirdQuarter
                mile
                finish
              }
              bet
              trainingTimes{
                date
              }
              horseWeight
              claimed
              claimedBy{
                name
              }
              status
              retiredDetails
              totalHorses
              horseAge
              comments
              confirmed
              raceId
              statsReady
              raceUrl
              finalStraightUrl
            }
          }            
        }
      }
    `,
    variables: {
      raceId: id
    }
  }

  return fetch("api/graphql", {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(result => {
    if (result.status !== 200 && result.status !== 201) {
      throw new Error("Failed")
    }
    return result.json()
  })
    .then(resData => {
      return resData.data.loadRace;
    })
}