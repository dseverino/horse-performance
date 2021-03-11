import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from "./components/Navigation/MainNavigation"

import AuthPage from "./pages/Auth/Auth";
import RacesPage from "./pages/Race/Races";
import HorsesPage from "./pages/Horse/Horses";
import SearchHorsePage from "./pages/Horse/SearchHorse";
import CreateHorsePage from "./pages/Horse/CreateHorse";
import AddHorseStable from "./pages/Horse/AddHorseStable";
import CreateJockeyPage from "./pages/Jockey/CreateJockey";
import JockeysPage from "./pages/Jockey/Jockey";
import StablePage from "./pages/Stable/Stable";
import CreateStablePage from "./pages/Stable/CreateStable";
import SearchStablePage from "./pages/Stable/SearchStable";
import StableAddTrainerPage from "./pages/Stable/AddTrainerStable"
import TrainerPage from "./pages/Trainer/Trainer";
import CreateTrainerPage from "./pages/Trainer/CreateTrainer";
import CreateProgramPage from "./pages/Program/CreateProgram";
import CreateRacePage from "./pages/Race/CreateRace";
import CreateWorkoutPage from "./pages/Workout/CreateWorkout";

class App extends Component {
  state = {
    userId: null,
    token: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ userId: userId, token: token })
  }
  logout = () => {
    this.setState({ userId: null, token: null })
  }
  render() {
    return (
      <Router>
        <React.Fragment>
          <MainNavigation />

          <main className="main-content">
            <Switch>
              {!this.state.token && <Redirect from="/" to="/auth" exact />}
              {this.state.token && <Redirect from="/" to="/horses" exact />}

              {!this.state.token && <Route path="/auth" component={AuthPage} />}
              {this.state.token && <Redirect from="/auth" to="/horses" exact />}
              <Route path="/createprogram" component={CreateProgramPage} />
              <Route path="/horses" component={HorsesPage} />
              <Route path="/createhorse" component={CreateHorsePage} />
              <Route path="/addhorsestable" component={AddHorseStable} />
              <Route path="/horseDetails" component={SearchHorsePage} />

              <Route path="/jockeys" component={JockeysPage} />
              <Route path="/createjockey" component={CreateJockeyPage} />
              <Route path="/stable" component={StablePage} />
              <Route path="/createstable" component={CreateStablePage} />
              <Route path="/SearchStable" component={SearchStablePage} />
              <Route path="/addtrainertostable" component={StableAddTrainerPage} />
              <Route path="/trainer" component={TrainerPage} />
              <Route path="/createtrainer" component={CreateTrainerPage} />

              <Route path="/races" component={RacesPage} />
              <Route path="/createrace" component={CreateRacePage} />

              <Route path="/createworkout" component={CreateWorkoutPage} />
            </Switch>
          </main>
        </React.Fragment>
      </Router >
    );
  }
}

export default App;
