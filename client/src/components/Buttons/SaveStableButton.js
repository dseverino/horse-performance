import React from "react"

import Backdrop from "../../components/Backdrop/Backdrop";
import Spinner from "../../components/Spinner/Spinner";

import Button from '@material-ui/core/Button';

const SaveStableButton = props => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  function saveHandler(event) {
          
    setIsLoading(true)
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
        stable: props.stable
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
        props.savedStable(resData.data.createStable);
        setIsLoading(false);  
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      })
  }

  return (
    <React.Fragment>
      <Button onClick={saveHandler} color="primary" >
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

export default SaveStableButton;