import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Home from "./Home";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <StrictMode >
    <BrowserRouter>
      <Home/>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);
