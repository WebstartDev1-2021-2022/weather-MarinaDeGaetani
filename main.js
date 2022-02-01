import tabJoursEnOdre from "./scripts/gestionTemps.js";

//Ajout des constantes :
const CLEAPI = "4c398198a97ce519dfc543aae27c25f4";
let resultatsAPI;
const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-act");
const temperatureHeures = document.querySelectorAll(".temperature-heures");
const joursDiv = document.querySelectorAll(".jour-a-venir");
const tempJoursDiv = document.querySelectorAll(".temperature-a-venir");
const imgIcone = document.querySelector(".logo-meteo");
const imgIconesPrev = document.querySelectorAll(".logo-meteo-bis");
const imgBackground = document.querySelectorAll(".fond-ecran");

//demande la position
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // console.log(position);
      let long = position.coords.longitude;
      let lat = position.coords.latitude;
      AppelAPI(long, lat);
    },
    () => {
      alert(
        "Vous avez refusé la géocalisation, l'application ne peut pas fonctionner, veiller l'activer"
      );
    }
  );
}

//Requête fetch :
function AppelAPI(long, lat) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={minutely&units=metric&lang=fr&appid=${CLEAPI}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      resultatsAPI = data;

      //affichage du temps actuel
      temps.innerText = resultatsAPI.current.weather[0].description;

      //affichage température actuel
      temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`;

      //afficher la localisation
      localisation.innerText = resultatsAPI.timezone;

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
          resultatsAPI.hourly[j * 1].temp
        )}°`;
      }

      // Trois premieres lettres des jours

      for (let k = 0; k < tabJoursEnOdre.length; k++) {
        joursDiv[k].innerText = tabJoursEnOdre[k].slice(0, 3);
      }

      //Temp par jours

      for (let m = 0; m < 7; m++) {
        tempJoursDiv[m].innerText = `${Math.trunc(
          resultatsAPI.daily[m + 1].temp.day
        )}°`;
      }

      // Icon meteo dynamique

      if (heureActuelle >= 6 && heureActuelle < 21) {
        imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`;
      } else {
        imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`;
      }

      // Icon-bis meteo dynamique

      if (heureActuelle >= 6 && heureActuelle < 21) {
        imgIconesPrev.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`;
      } else {
        imgIconesPrev.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`;
      }

      // fond appli meteo dynamique

      if (heureActuelle >= 6 && heureActuelle < 21) {
        imgBackground.src = `./ressources/fond-jour/${resultatsAPI.current.weather[0].background}.svg`;
      } else {
        imgBackground.src = `./ressources/fond-nuit/${resultatsAPI.current.weather[0].background}.svg`;
      }
    });
}

//autre manière de faire :
// function getWeatherOf = (lat, lon) => {}
