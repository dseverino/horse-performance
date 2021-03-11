import React, { Component } from "react";

//import { AuthContext } from "../../context/auth-context";

import "./Auth.css"

class AuthPage extends Component {
  state = {
    isLogin: true
  }

  //static contextType = AuthContext;

  constructor(props) {
    super(props)
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  changeTitle = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin }
    })
  }

  submitHandler = (event) => {
    event.preventDefault()
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    }
    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser ($email: String!, $password: String!){ 
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
              password
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
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
        if (resData.data.login.token) {
          this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <div className="card col-5 mx-auto px-4 py-5">
          <form onSubmit={this.submitHandler} >
            <div className="form-group d-flex align-items-baseline px-3">
              <i className="fas fa-user" ></i>
              <input type="email" autoComplete="off" className="form-control" placeholder="Username" ref={this.emailEl} />
            </div>
            <div className="form-group d-flex align-items-baseline px-3">
              <i className="fas fa-unlock-alt"></i>
              <input type="password" autoComplete="off" className="form-control" placeholder="Password" ref={this.passwordEl} />
            </div>
            <div className="form-actions" style={{ float: "right" }}>
              <button className="btn" type="submit">Submit</button>
              <button type="button" className="btn" onClick={this.changeTitle}>Switch to {this.state.isLogin ? "Signup" : "Login"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AuthPage