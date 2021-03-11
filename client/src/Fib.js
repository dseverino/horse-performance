import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    values: {}
  };

  componentDidMount() {
    this.fetchValues();    
  }

  async fetchValues() {
    const requestBody = {
      query: `
        query {
          jockeys {
            _id
            name            
          }
        }
      `
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
        console.log( resData.data.jockeys )
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleSubmit = async event => {
    event.preventDefault();
    
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={''}
            onChange={() => console.log('changed')}
          />
          <button>Submit</button>
        </form>
        
      </div>
    );
  }
}

export default Fib;
