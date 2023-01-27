import { Provider as StateProvider } from "react-redux";
import AppRouter from "./routers/AppRouter";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import store from "./store/store";
import "./styles/custom.scss";
import "bootstrap/dist/js/bootstrap.bundle";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <StateProvider store={store}>
            <AppRouter />
        </StateProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
