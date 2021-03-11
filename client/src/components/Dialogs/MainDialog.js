import React from "react";
import ReactDOM from 'react-dom';

class MainDialog extends React.Component {
  render() {
    return ReactDOM.createPortal(
      this.props.children,
      document.getElementById('modal')
    )
  }

}
export default MainDialog;