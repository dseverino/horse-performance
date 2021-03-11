import React from "react";
import { NavLink } from "react-router-dom"

import "./MainNavigation.css"

const token = true;

const mainNavigation = props => (

  <div className="cdm-header" style={{ padding: "0px" }}>

    <div style={{ display: "inline", minWidth: "680px" }}>
      <h6 className="cdm-header-title">Easy Horse</h6>

      <nav className="navbar navbar-default" style={{ border: "none", backgroundColor: "transparent", margin: "-7px 0px 0px 5px" }}>

        <ul className="nav" style={{ marginLeft: "47px" }}>
          {
            !token && <li style={{ marginRight: "30px" }}>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          }

          <li className="dropdown">
            <NavLink to="/programs" className="dropbtn">
              Programs
                </NavLink>
            <div className="dropdown-content">
              <NavLink to="/createprogram">Create Program</NavLink>
            </div>
          </li>

          <li className="dropdown">
            <NavLink to="/races" className="dropbtn">
              Races
                </NavLink>
            <div className="dropdown-content">
              <NavLink to="/createRace">Create Race</NavLink>
            </div>
          </li>

          <li className="dropdown">
            <NavLink to="/horses" className="dropbtn">
              Horses
                </NavLink>
            <div className="dropdown-content">
              <NavLink to="/createhorse">Create Horse</NavLink>
              <NavLink to="/addhorsestable">Add Horse to Stable</NavLink>
              <NavLink to="/horseDetails">Load Horse details</NavLink>
            </div>
          </li>

          <li className="dropdown">
            <NavLink to="/jockeys" className="dropbtn">
              Jockeys
                </NavLink>
            <div className="dropdown-content">
              <NavLink to="/createjockey">Create Jockey</NavLink>
            </div>
          </li>

          <li className="dropdown">
            <NavLink to="/stable" className="dropbtn">
              Stables
                </NavLink>
            <div className="dropdown-content">
              <NavLink to="/createstable">Create Stable</NavLink>
              <NavLink to="/searchstable">Search Stable</NavLink>
              <NavLink to="/addtrainertostable">Add Trainer to Stable</NavLink>
            </div>
          </li>

          <li className="dropdown">
            <NavLink to="/trainer" className="dropbtn">
              Trainers
                </NavLink>
            <div className="dropdown-content">
              <NavLink to="/createtrainer">Create Trainer</NavLink>
            </div>
          </li>

          <li className="dropdown">
            <NavLink to="/workouts" className="dropbtn">
              Workouts
                </NavLink>
            <div className="dropdown-content">
              <NavLink to="/createworkout">Create Workout</NavLink>
            </div>
          </li>

        </ul>
      </nav>

    </div>

  </div>
)


export default mainNavigation;