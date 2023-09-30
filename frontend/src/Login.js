// LOGIN DE USUARIOS
import { useRef, useState, useEffect, useContext } from "react";

import axios from "./api/axios";
//const LOGIN_URL = "http://localhost:3500/users/login";
const LOGIN_URL = "http://nodej-loadb-1hlll7ypgzzld-13bfa31c2b9c223c.elb.us-east-1.amazonaws.com:3500/users/login";

// Configuracion
const Login = ({ onLogin }) => {
  
  const userRef = useRef();
  const errRef = useRef();

  // Determinar estados
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Hook de enfoque
  useEffect(() => {
    userRef.current.focus();
  }, []);
  
  // Hook para error
  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  // Ingreso de user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { user, pwd };
      onLogin(userData);
      
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));

      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      if (!err.response) {
        setErrMsg("Sin Respuesta del Servidor");
      } else if (err.response?.status === 400) {
        setErrMsg("Falta nombre de usuario o contraseña");
      } else if (err.response?.status === 401) {
        setErrMsg("No esta Registrado");
      } else {
        setErrMsg("Ingreso Fallido");
      }
      errRef.current.focus();
    }
  };
  
  // Diseño de pagina
  return (
    <>
      {success ? (
        <section>
          <h1>Ingreso Exitoso!</h1>
          <br />
          <p>
            <a href="Events">Ve a Eventos</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1> Ingresar </h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user} // importante to clear the inputs upon submission
              required
            />

            <label htmlFor="pasword">Contraseña:</label>
            <input
              type="password" // Ocultar el texto
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd} // importante dejar en blanco despues de ingresar
              required
            />

            <button>Ingresar</button>
          </form>
          <p>
            No tienes una cuenta?
            <br />
            <span className="line">
             
              <a href="Register">Registrate</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
