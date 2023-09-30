// Componente de Eventos
import React, { useState, useEffect } from "react";
import axios from "axios";

function Events() {
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showSignUpButton, setShowSignUpButton] = useState(true);

  useEffect(() => {
    // Conectar a la API y buscar todos los eventos y los eventos que el usuario registro
    axios
      //.get("http://localhost:3500/users/events", { withCredentials: true })
      .get("http://nodej-loadb-1hlll7ypgzzld-13bfa31c2b9c223c.elb.us-east-1.amazonaws.com:3500/users/events", { withCredentials: true })
      .then((response) => {
        const allEvents = response.data;
        const userEvents = response.data.filter(
          (event) => event.isUserRegistered
        );

        // Actualizar los eventos con la isUserRegistered
        const eventsWithRegistrationStatus = allEvents.map((eventItem) => ({
          ...eventItem,
          isUserRegistered: userEvents.some(
            (userEvent) => userEvent._id === eventItem._id
          ),
        }));

        setEvents(eventsWithRegistrationStatus);
        setUserEvents(userEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error.message);
      });
  }, []);

  // Registrarse en el evento elegido
  const handleSignUp = (eventId) => {
    setUserEvents((prevUserEvents) => [
      ...prevUserEvents,
      { _id: eventId, isUserRegistered: true },
    ]);
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === eventId ? { ...event, isUserRegistered: true } : event
      )
    );

    // Ocultar el boton temporalmente
    setShowSignUpButton(false);

    // Conectar a la API y registrar el evento elegido
    axios
      .post(
        //`http://localhost:3500/users/events/${eventId}/signup`,
        `http://nodej-loadb-1hlll7ypgzzld-13bfa31c2b9c223c.elb.us-east-1.amazonaws.com:3500/users/events/${eventId}/signup`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.success) {
          console.log("Successfully signed up for event:", eventId);

          // Mensaje de exito
          setRegistrationSuccess(true);

          // Actualizar eventos con isUserRegistered
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event._id === eventId
                ? { ...event, isUserRegistered: true }
                : event
            )
          );
          setUserEvents((prevUserEvents) => [
            ...prevUserEvents,
            { _id: eventId, isUserRegistered: true },
          ]);
        } else {
          console.error("Error signing up for event:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error signing up for event:", error.message);

        // Revertir la actualizacion en caso de error
        setUserEvents((prevUserEvents) =>
          prevUserEvents.filter((event) => event._id !== eventId)
        );
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, isUserRegistered: false }
              : event
          )
        );
      });
  };

  console.log("All Events:", events);
  console.log("User Events:", userEvents);

  // Si no carga la imagen, entonces cargar esta
  const placeholderImage =
    "https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80";

  const onImageError = (e) => {
    e.target.src = placeholderImage;
  };

  return (
    <div>
      <h1>Bienvenido a tu Pagina de Eventos!</h1>

      <h2>Eventos Disponibles:</h2>
      <ul className="App-header ul2">
        {[...new Map(events.map((event) => [event._id, event])).values()].map(
          (uniqueEvent) => (
            <li key={uniqueEvent._id}>
              <div>
                <img
                  src={uniqueEvent.imageUrl}
                  alt={uniqueEvent.name}
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                  onError={onImageError}
                />
              </div>
              <div>
                <p>
                  {uniqueEvent.name} - {uniqueEvent.date}
                </p>
                <button
                  onClick={() => {
                    setSelectedEvent(uniqueEvent);
                    setShowSignUpButton(true);
                    setRegistrationSuccess(false);
                  }}
                >
                  Ver Evento
                </button>
              </div>
            </li>
          )
        )}
      </ul>

      {selectedEvent && (
        <div>
          <h3>Evento Seleccionado: {selectedEvent.name}</h3>
          <br></br>
          <p>Fecha: {selectedEvent.date}</p>
          <br></br>
          <h3>Descripcion:</h3>
          <br></br>
          <p>{selectedEvent.description}</p>
          <br></br>
          {showSignUpButton && !registrationSuccess && (
            <button
              onClick={() => handleSignUp(selectedEvent._id)}
              disabled={selectedEvent.isUserRegistered}
            >
              {selectedEvent.isUserRegistered ? "Ya Registrado" : "Registrarse"}
            </button>
          )}
          {registrationSuccess && <p>Registro Exitoso!</p>}
        </div>
      )}
    </div>
  );
}

export default Events;
