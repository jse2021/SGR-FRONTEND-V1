import React from "react";
import ReactDOM from "react-dom/client";
import { CalendarApp } from "./CalendarApp.jsx";
import "./styles.css";
import { Provider } from "react-redux"; //
import { store } from "./store"; //

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <CalendarApp />
    {/* </Provider> */}
  </React.StrictMode>
);
