import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";
import StoreContextProvider from "./context/StoreContext.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StoreContextProvider>
      <Auth0Provider
        domain="dev-7x12ac2q12g8b3qv.us.auth0.com"
        clientId="pwbD4ENeV8VowtKwNSFuNmaBim4gF02m"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}>
        <App />
      </Auth0Provider>
      ,
    </StoreContextProvider>
  </BrowserRouter>
);
