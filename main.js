import tabJoursEnOdre from "./scripts/gestionTemps.js";

//Ajout des constantes :
const CLEAPI = "4c398198a97ce519dfc543aae27c25f4";
let weatherData;

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-act");
const temperatureHeures = document.querySelectorAll(".temperature-heures");
const joursDiv = document.querySelectorAll(".jour-a-venir");
const tempJoursDiv = document.querySelectorAll(".temperature-jour");
const imgIcone = document.querySelector(".logo-meteo");
const imgIconesPrev = document.querySelectorAll(".logo-meteo-bis");
const imgBackground = document.querySelectorAll(".fond-ecran");

//demande la position
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // console.log(position);
      let longitude = position.coords.longitude;
      let lattitude = position.coords.latitude;
      AppelAPI(longitude, lattitude);
    },
    () => {
      alert(
        "Vous avez refusé la géocalisation, l'application ne peut pas fonctionner, veiller l'activer"
      );
    }
  );
}

//Requête fetch :
function AppelAPI(longitude, lattitude) {
  try {
    const allPromise = Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude={minutely&units=metric&lang=fr&appid=${CLEAPI}`
      ),
      fetch(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${lattitude}`
      ),
    ]);

    const [weatherResult, cityResult] = await allPromise;

    const weatherData = await weatherResult.json();

    const cityData = await cityResult.json();

    weatherData = data;

    //affichage du temps actuel
    temps.innerText = weatherData.current.weather[0].description;

    //affichage température actuel
    temperature.innerText = `${Math.trunc(weatherData.current.temp)}°`;

    //afficher la localisation
    localisation.innerText = weatherData.timezone;

    //les heures, par tranche de 1 avec leurs temperature

    let heureActuelle = new Date().getHours();

    for (let i = 0; i < heure.length; i++) {
      let heureIncr = heureActuelle + i * 1;

      if (heureIncr > 24) {
        heure[i].innerText = `${heureIncr - 24} h`;
      } else if (heureIncr === 24) {
        heure[i].innerText = "00 h";
      } else {
        heure[i].innerText = `${heureIncr} h`;
      }
    }

    // temperatures par tranche de 1h
    for (let j = 0; j < temperatureHeures.length; j++) {
      temperatureHeures[j].innerText = `${Math.trunc(
        weatherData.hourly[j * 1].temp
      )}°`;
    }
    //debugger;

    // Trois premieres lettres des jours

    for (let k = 0; k < tabJoursEnOdre.length; k++) {
      joursDiv[k].innerText = tabJoursEnOdre[k].slice(0, 3);
    }
    console.log(joursDiv);

    //Temp par jours

    for (let m = 0; m < 7; m++) {
      tempJoursDiv[m].innerText = `${Math.trunc(
        weatherData.daily[m + 1].temp.day
      )}°`;
    }

    // Icon meteo dynamique

    if (heureActuelle >= 6 && heureActuelle < 21) {
      imgIcone.src = `./ressources/jour/${weatherData.current.weather[0].icon}.svg`;
    } else {
      imgIcone.src = `./ressources/nuit/${weatherData.current.weather[0].icon}.svg`;
    }

    // Icon-bis meteo dynamique

    if (heureActuelle >= 6 && heureActuelle < 21) {
      imgIconesPrev.src = `./ressources/jour/${weatherData.current.weather[0].icon}.svg`;
    } else {
      imgIconesPrev.src = `./ressources/nuit/${weatherData.current.weather[0].icon}.svg`;
    }

    // fond appli meteo dynamique
    if (heureActuelle >= 5 && heureActuelle < 8) {
      imgBackground.src = `./ressources/fond-jour/sunrise.jpg`;
    } else if (heureActuelle >= 8 && heureActuelle < 21) {
      imgBackground.src = `./ressources/fond-day/day.jpg`;
    } else {
      imgBackground.src = `./ressources/fond-nuit/illustartion-nuit.jpg`;
    }
  } catch (error) {
    console.error("erreur dans le trycatch :", error);
  }
}

// autre manière de faire :
// Cours du prof :
// function getWeatherOf = (lat, lon) => {}
// const temps = document.querySelector("temps");
// const temperature = document.querySelector("temperature");
// const localisation = document.querySelector("localisation"); //
// const dateNow = document.querySelector(".date");
//
// Traiter les erreurs de navigation geolocalisation.       GetCurrencisePosition
// const handleGetCurrentPositionError = (error) => {
//   alert("La géolocalisation ne fonctionne pas, vérifirez vos paramètres");
// };
//
// Requête fetch
// const getWeatherOf = async (position) => {
//   try {
//     const lat = position.coords.latitutde;
//     const lon = position.coords.longitude;
//     CallAPI = (lat, lon);
//     const res = await fetch(
//       https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&lang=fr&appid=e5b64fa8a92d01f6f8fc1d823e6fa138
//     );
//     const data = await res.json();
//
// console.log(data);
//
// console.log(data);
//   } catch (error) {
//     console.error("Erreur");
//
// Requête HTTP 2 en 1 (requête concurrentes):
//
//
