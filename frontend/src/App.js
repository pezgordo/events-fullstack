// App Principal
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Events from "./Events";

//const LOGIN_URL = "http://localhost:3500/users/login";
const LOGIN_URL = "http://nodej-loadb-1hlll7ypgzzld-13bfa31c2b9c223c.elb.us-east-1.amazonaws.com:3500/users/login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Conectar a la API para verificar Login
  const handleLogin = async (userData) => {
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify(userData), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  // Establecer Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    // DIAGRAMA DE FLUJO DE LA PAGINA
    <Router>
      <div className="App">
        <ul className="App-header">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/Login">Igresar</Link>
              </li>
              <li>
                <Link to="/Register">Registrarse</Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/" onClick={handleLogout}>
                Salir
              </Link>
            </li>
          )}
        </ul>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Login"
            element={
              !isLoggedIn ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/Events" />
              )
            }
          />
          <Route path="/Register" element={<Register />} />
          <Route path="/Events" element={<Events />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
