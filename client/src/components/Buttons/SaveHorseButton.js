import React from "react"

import Backdrop from "../../components/Backdrop/Backdrop";
import Spinner from "../../components/Spinner/Spinner";

import Button from '@material-ui/core/Button';

const SaveHorseButton = props => {
  const [isLoading, setIsLoading] = React.useState(false);

  function saveHandler(event) {

    setIsLoading(true)
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
        horse: props.horse
      }
    }

    fetch("api/graphql", {
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
        setIsLoading(false);
        props.savedHorse(resData.data.createHorse);        
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      })
  }

  return (
    <React.Fragment>
      <Button disabled={!props.horse.name} onClick={saveHandler} color="primary" >
        Save
      </Button>
      {
        isLoading &&
        (
          <React.Fragment>
            <Spinner />
            <Backdrop />
          </React.Fragment>
        )
      }
    </React.Fragment>
  )
}

export default SaveHorseButton;