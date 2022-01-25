//Ajout des constantes :

const dateHeure = document.querySelector("date_heure");
const hours = document.querySelectorAll("hours");
const days = document.querySelectorAll("days");

//Traiter les erreurs de navigator.geolocation.getCurrentPosition
const handleGetCurrentPositionError = (error) => {
  alert("Votre géocalisation ne fonctionne pas, vérifier vos paramètres");
};

//Requête fetch :
const getWeatherOf = async (position) => {
  try {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&lang=fr&appid=4c398198a97ce519dfc543aae27c25f4`
    );
    const data = await res.json();
    updateUI(data);
  } catch (error) {
    console.error("Erreur dans le getWeatherOf ()", error);
  }
};
const updateUI = (data) => {
  console.log(data);
};
//autre manière de faire :
// function getWeatherOf = (lat, lon) => {}
//Demande de geocalisation
navigator.geolocation.getCurrentPosition(
  getWeatherOf,
  (error) => console.log("getCurrentPosition error", error),
  { timeout: 6000 }
);

//TODO ajout des villes avec une API
//TODO ajout heure et date
//TODO changement icon et image en fonction du temps et du moment de la journée
