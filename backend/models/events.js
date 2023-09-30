// MODELO DE ESQUEMA DE EVENTOS
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("Event", eventSchema);

// Fucion para iniciar los eventos en el servidor
async function initializeFixedEvents() {
  const fixedEventsData = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Evento de Deportes",
      date: "2023-10-01",
      description:
        "La Maratón Estacional desafía a los corredores a conquistar 42 kilómetros a través de paisajes que representan las cuatro estaciones en un solo evento. Desde nieve invernal hasta flores primaverales, esta carrera única combina resistencia física con adaptabilidad a condiciones climáticas cambiantes.",
      tags: ["fixed"],
      imageUrl:
        "https://img.freepik.com/premium-psd/training-sport-flyer-social-media-post-banner-template_488814-357.jpg?w=900",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Evento de Fiesta",
      date: "2023-10-15",
      description:
        "La ElectroFiesta es un torbellino de música electrónica, luces hipnotizantes y un ambiente vibrante. Con DJ de élite y ritmos envolventes, esta fiesta ofrece una experiencia eléctrica que hará que todos se sumerjan en la euforia del sonido electrónico. ¡Prepárate para una noche de pura energía y ritmo inigualable!",
      tags: ["fixed"],
      imageUrl:
        "https://img.freepik.com/free-psd/club-dj-party-flyer-social-media-post_505751-3658.jpg?w=900&t=st=1696027790~exp=1696028390~hmac=2e612a49b9eacdcfc9efbe4e99690cde6d803415b4a5d44c9201a657eb485c66",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: "Evento de Comidas",
      date: "2023-11-23",
      description:
        "El Festín Gastronómico Global es un deleite para los amantes de la comida. Reuniendo lo mejor de la cocina mundial, este evento ofrece una experiencia culinaria única con una variedad de platos exquisitos preparados por chefs de renombre. Desde delicias locales hasta sabores exóticos, los asistentes pueden explorar un festín de opciones gastronómicas en un ambiente festivo y acogedor. ¡Una celebración para los paladares más exigentes!",
      tags: ["fixed"],
      imageUrl:
        "https://img.freepik.com/premium-vector/summer-food-festival-poster_1340-15727.jpg?w=900",
    },
  ];

  try {
    await Event.deleteMany({});
    const fixedEvents = await Event.insertMany(fixedEventsData);
    console.log("Eventos Fijos Iniciados:", fixedEvents);
  } catch (error) {
    console.error("Error Iniciando Eventos Fijos:", error);
  }
}

module.exports = { Event, initializeFixedEvents };
