import React from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import 'bootstrap/dist/css/bootstrap.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
//import App from "./App";
import MainPage from "./pages/MainPage/MainPage";

ReactDOM.render(<MainPage />, document.getElementById("root"));
