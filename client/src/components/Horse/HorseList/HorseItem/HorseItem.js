import React from "react";

import "./HorseItem.css";

const horseItem = props => {    
  return (
    <li className="horse__list-item">
      <div>
        <h1>{props.name}</h1>
        <h2>{props.age} - {props.sex}</h2>
      </div>
      <div>
        <button onClick={props.onDetails.bind(this, props.horseId)} className="btn">View Details</button>                
      </div>
    </li>
  )
};

export default horseItem;
