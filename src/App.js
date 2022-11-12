import React from "react";
import { Route, Routes } from "react-router";
import "rsuite/dist/rsuite.min.css";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import "./styles/main.scss";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<PublicRoute>
        <SignIn />
      </PublicRoute>} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
