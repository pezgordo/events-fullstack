// REGISTRO DE USUARIOS
import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "./api/axios";

// Valida que el nombre de usuario debe comenzar con una letra minúscula o mayúscula.
//Debe estar seguido de 3 a 23 caracteres que pueden ser letras minúsculas o mayúsculas, dígitos, guiones o guiones bajos.
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

// La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un dígito y un carácter especial.
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

// Direccion de coneccion en la API
//const REGISTER_URL = "http://localhost:3500/users";
const REGISTER_URL = "http://nodej-loadb-1hlll7ypgzzld-13bfa31c2b9c223c.elb.us-east-1.amazonaws.com:3500/users";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  // Estados del user
  const [user, serUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  // Estados del pwd
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  // Estado de coincidencia de pwd
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // Estados de posibles errores
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // usar Hook de enfoque para el user
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validar nombre de usuario
  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  // Validar contraseña
  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    // Deben coincidir los dos campos
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  // Mensaje de Error
  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  // Manejo de Registro con la API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalido");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Sin Respuesta del Servidor");
      } else if (err.response?.status === 409) {
        setErrMsg("Ya Existe ese Usuario");
      } else {
        setErrMsg("Fallo de Registro");
      }
      errRef.current.focus();
    }
  };

  // Diseño de Pagina
  return (
    <>
      {success ? (
        <section>
          <h1>Registro Exitoso!</h1>
          <p>
            <a href="Login">Ingresar</a>
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
          <h1>Registro de Usuarios</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Usuario:
              <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />{" "}
                {/* Si es valido dibuja un check verde */}
              </span>
              <span className={validName || !user ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} /> {/* Dibuja una X roja */}
              </span>
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off" // Apagar sugerencias
              onChange={(e) => serUser(e.target.value)} // Establecer es estado del user
              required
              aria-invalid={validName ? "false" : "true"} // Comprobar si tiene input valido
              aria-describedby="uidnote" // Describe el campo de input
              onFocus={() => setUserFocus(true)} // Si el campo del user input tiene focus
              onBlur={() => setUserFocus(false)} // Cuando dejas el campo deja el focus
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              {" "}
              {/* user focus es true and user state existe, Si no esta vacio, por lo menos un caracter fue typeado*/}
              <FontAwesomeIcon icon={faInfoCircle} />
              4 a 24 caracteres.
              <br />
              Debe empezar con una letra.
              <br />
              Letras, numeros, guion y guion bajo permitido.
            </p>
            <label htmlFor="password">
              Contraseña:
              <span className={validPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} /> {/* Dibujar check verde */}
              </span>
              <span className={validPwd || !user ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} /> {/* Dibujar X roja */}
              </span>
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)} // Establecer el estado de pwd
              required
              aria-invalid={validPwd ? "false" : "true"} // Es valido o no
              aria-describedby="pwdnote" // Describe el pwd field
              onFocus={() => setPwdFocus(true)} // Si pwd field tiene focus
              onBlur={() => setPwdFocus(false)} // Cuando dejas el pwd field focus
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 a 24 caracteres.
              <br />
              Debe incluir una mayuscula y una minuscula, un numero y un
              caracter especial.
              <br />
              Caracteres permitidos:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>
            <label htmlFor="confirm_pwd">
              Confirmar Contraseña:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Debe ser igual a la Contraseña ingresada.
            </p>
            <button
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Registrarse
            </button>{" "}
            {/* Los 3 deben ser validos para habilitar el boton */}
          </form>
          <p>
            Ya esta registrado?
            <br />
            <span className="line">
              <a href="Login">Ingresar</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
