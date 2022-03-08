import tabJoursEnOdre from "./scripts/gestionTemps.js";

//Ajout des constantes :
const CLEAPI = "4c398198a97ce519dfc543aae27c25f4";

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-act");
const temperatureHeures = document.querySelectorAll(".temperature-heures");
const joursDiv = document.querySelectorAll(".jour-a-venir");
const tempJoursDiv = document.querySelectorAll(".temperature-jour");
const imgIcone = document.querySelector(".logo-meteo");
const imgIconesHours = document.querySelectorAll(".logo-meteo-hourly");
const imgIconesDaily = document.querySelectorAll(".logo-meteo-daily");
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
async function AppelAPI(longitude, lattitude) {
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

    //affichage du temps actuel
    temps.innerText = weatherData.current.weather[0].description;

    //affichage température actuel
    temperature.innerText = `${Math.trunc(weatherData.current.temp)}°`;

    //afficher la localisation
    localisation.innerText = weatherData.timezone;

    //les heures, par tranche de 1 avec leurs temperatures

    let heureActuelle = new Date().getHours();

    for (let i = 0; i < heure.length; i++) {
      let heureIncr = heureActuelle + i;

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
    for (let k = 0; k < tabJoursEnOdre.length - 1; k++) {
      //console.log(k, joursDiv[k]);
      joursDiv[k].innerText = tabJoursEnOdre[k].slice(0, 3);
    }

    //Temp par jours

    for (let m = 0; m < 6; m++) {
      //console.log(tempJoursDiv[m]);
      tempJoursDiv[m].innerText = `${Math.trunc(
        weatherData.daily[m + 1].temp.day
      )}°`;
    }

    // Icon meteo dynamique

    if (heureActuelle >= 6 && heureActuelle < 21) {
      console.log(imgIcone);
      imgIcone.src = `./ressources/jour/${weatherData.current.weather[0].icon}.svg`;
    } else {
      imgIcone.src = `./ressources/nuit/${weatherData.current.weather[0].icon}.svg`;
    }

    // Icon meteo dynamique par heure

    if (heureActuelle >= 6 && heureActuelle < 21) {
      imgIconesHours.src = `./ressources/jour/${weatherData.hourly.weather[0].icon}.svg`;
    } else {
      imgIconesHours.src = `./ressources/nuit/${weatherData.hourly.weather[0].icon}.svg`;
    }

    // Icon meteo dynamique par jours

    if (heureActuelle >= 6 && heureActuelle < 21) {
      imgIconesDaily.src = `./ressources/jour/${weatherData.daily.weather[0].icon}.svg`;
    } else {
      imgIconesDaily.src = `./ressources/nuit/${weatherData.daily.weather[0].icon}.svg`;
    }

    // fond appli meteo dynamique
    //if (heureActuelle >= 5 && heureActuelle < 8) {
    //  imgBackground.src = `./ressources/fond-jour/sunrise.jpg`;
    //} else if (heureActuelle >= 8 && heureActuelle < 21) {
    //  imgBackground.src = `./ressources/fond-day/day.jpg`;
    //} else {
    //  imgBackground.src = `./ressources/fond-nuit/illustartion-nuit.jpg`;
    //}
  } catch (error) {
    console.error("erreur dans le trycatch :", error);
  }
}
