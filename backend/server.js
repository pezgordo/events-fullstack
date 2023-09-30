//SERVIDOR PRINCIPAL
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routes/users");
const { initializeFixedEvents } = require("./models/events");
const app = express();

// Cors para permitir comunicacion
//app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cors({ credentials: true, origin: "http://nodej-loadb-1hlll7ypgzzld-13bfa31c2b9c223c.elb.us-east-1.amazonaws.com:3000" }));

// Conectar con la db
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", async () => {
  console.log("Connected to Database");
  await initializeFixedEvents();
});

// Usar express
app.use(express.json());

// Usar nuestra API
app.use("/users", usersRouter);

// Iniciar en puerto 3500
app.listen(3500, () => console.log("Servidor Inicializado"));
