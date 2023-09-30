// REST API
// TODAS LAS RUTAS Y FUNCIONES ADICIONALES
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { Event, initializeFixedEvents } = require("../models/events");

const session = require("express-session");
const MongoStore = require("connect-mongo");

// Crear nueva instancia de mongoStore
const mongoStore = MongoStore.create({
  mongoUrl: process.env.DATABASE_URL,
  collectionName: "sessions",
});

// Middleware de session
router.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

// Login
router.post("/login", async (req, res) => {
  const { user, pwd } = req.body;

  try {
    console.log("Received credentials:", { user, pwd });

    // Encontrar al user en la database
    const foundUser = await User.findOne({ user });

    // debugging
    console.log("Found user:", foundUser);

    // Si no se encontro al usuario devolver error
    if (!foundUser) {
      console.log("User not found");
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Comparar pwd ingresado con el de la database
    if (pwd === foundUser.pwd) {
      // Establecer Id de usuario
      req.session.userId = foundUser._id;

      // Si los pwd coinciden hacer login
      return res
        .status(200)
        .json({ success: true, message: "Login successful" });
    } else {
      // Si los pwd no son iguales return error
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    // Manejar otros erroes
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Errorr" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  // Destroy la session al salir
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    } else {
      res.json({ success: true, message: "Logout successful" });
    }
  });
});

// middleware to set req.user
router.use((req, res, next) => {
  req.user = req.session.userId;
  next();
});

// Router de eventos
router.get("/events", async (req, res) => {
  try {
    console.log("Session:", req.session);
    console.log("User ID:", req.user);

    // Verificar user
    const userId = req.user;

    // Recolectar eventos que user va a asistir
    const userEvents = await getUserSpecificEvents(userId);

    console.log("User Events:", userEvents);

    // Recolectar eventos de la db
    const fixedEvents = await getFixedEvents();

    // combiar eventos de usuario con los de la db
    const allEvents = [...userEvents, ...fixedEvents];

    console.log("All Events:", allEvents);
    console.log("fixed events:", fixedEvents);

    res.json(allEvents);
  } catch (error) {
    console.error("Error handling events request:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Errorrr" });
  }
});

// Funcion de eventos de user
async function getUserSpecificEvents(userId) {
  try {
    // buscar por id de user
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // buscar eventos de user
    const userEvents = await Event.find({ _id: { $in: user.events } });

    const eventsWithRegistrationStatus = userEvents.map((event) => {
      const isUserRegistered = user.events.includes(event._id.toString());
      return { ...event.toObject(), isUserRegistered };
    });

    //return eventos de user
    return eventsWithRegistrationStatus;
  } catch (error) {
    console.error("Error fetching user-specific events:", error);
    throw error;
  }
}

// Funcion de buscar eventos de la db
async function getFixedEvents() {
  try {
    // buscar eventos de la db
    const fixedEvents = await Event.find({ tags: "fixed" });

    return fixedEvents;
  } catch (error) {
    console.error("Error fetching fixed events:", error);
    throw error;
  }
}

// Router de buscar eventos relacionados al id del user
router.post("/events/:eventId/signup", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user;

    // buscar user por id
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already signed up for the event
    if (user.events.includes(eventId)) {
      return res.status(400).json({
        success: false,
        message: "User is already signed up for this event",
      });
    }

    // Actualizar la lista de eventos del usuario para incluir nuevo evento
    user.events.push(eventId);
    await user.save();

    res.json({
      success: true,
      message: "Successfully signed up for the event",
    });
  } catch (error) {
    console.error("Error handling event signup:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//////// PRUEBAS DE RECOLECCION DE DATOS DE LA DB
// Obtener todos
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Obtener Uno
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});
// Crear Uno
router.post("/", async (req, res) => {
  // Verificar si ya existe el user
  const existingUser = await User.findOne({ user: req.body.user });

  if (existingUser) {
    // Si el user ya existe
    return res.status(409).json({ status: "Username is already registered" });
  }

  // Si el user no existe proceder a ingresar nuevo user
  const user = new User({
    user: req.body.user,
    pwd: req.body.pwd,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar uno
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.user != null) {
    res.user.user = req.body.user;
  }

  if (req.body.pwd != null) {
    res.user.pwd = req.body.pwd;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Borrar uno
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: "Deleted Subscriber" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Borrar todos los users
router.delete("/", async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: "Deleted all users" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// funcion de getUser
async function getUser(req, res, next) {
  try {
    const userName = res.user;

    user = await User.findById(req.params.id);

    if (user == null) {
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
