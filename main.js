import tabJoursEnOdre from "./scripts/gestionTemps.js";

//Ajout des constantes :
const CLEAPI = "4c398198a97ce519dfc543aae27c25f4";

const main = document.querySelector("body");
const template = document.querySelector("template");

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

    // cloner le template
    const templateClone = template.content.cloneNode(true);

    // Accéder aux nœuds du template
    const temps = templateClone.querySelector(".temps");
    const temperature = templateClone.querySelector(".temperature");
    const localisation = templateClone.querySelector(".localisation");
    const heureActuelle = templateClone.querySelectorAll(".heure-act");
    const temperatureHeures = templateClone.querySelectorAll(
      ".temperature-heures"
    );
    const joursDiv = templateClone.querySelectorAll(".jour-a-venir");
    const tempJoursDiv = templateClone.querySelectorAll(".temperature-jour");
    const imgIcone = templateClone.querySelector(".logo-meteo");
    const imgIconesHours = templateClone.querySelectorAll(".logo-meteo-hourly");
    const imgIconesDaily = templateClone.querySelectorAll(".logo-meteo-daily");

    //icone jour et nuits
    //const day = ;
    //const last_element = day[day.length - 1];

    //affichage du temps actuel
    temps.innerText = weatherData.current.weather[0].description;

    //affichage température actuel
    temperature.innerText = `${Math.trunc(weatherData.current.temp)}°`;

    //afficher la localisation
    localisation.innerText = weatherData.timezone;

    //afficher l'icone
    imgIcone.src = `./ressources/jour/${weatherData.current.weather[0].icon}.svg`;

    //les heures, par tranche de 1 avec leurs temperatures
    // for (const [index, hourly] of weatherData.hourly.entries()) {
    for (let index = 0; index < 24; index++) {
      // Récupérer heure, température et icône
      const { dt, temp, weather } = weatherData.hourly[index];
      const heure = new Date(dt * 1000).getHours();
      const { icon } = weather[0];
      //debugger;
      //console.log(imgIconesHours[index]);
      heureActuelle[index].innerText = `${heure} h`;
      temperatureHeures[index].innerText = `${Math.trunc(temp)}°`;
      imgIconesHours[index].src = `./ressources/jour/${icon}.svg`;
    }

    // //Temp par jours
    for (let index = 0; index < 6; index++) {
      const { temp, weather } = weatherData.daily[index];
      const { icon } = weather[0];

      joursDiv[index].innerText = tabJoursEnOdre[index].slice(0, 3);
      tempJoursDiv[index].innerText = `${Math.trunc(temp.day)}°`;
      imgIconesDaily[index].src = `./ressources/jour/${icon}.svg`;
    }

    // let heureActuelle = new Date().getHours()

    // for (let i = 0; i < heure.length; i++) {
    //   let heureIncr = heureActuelle + i

    //   if (heureIncr > 24) {
    //     heure[i].innerText = `${heureIncr - 24} h`
    //   } else if (heureIncr === 24) {
    //     heure[i].innerText = '00 h'
    //   } else {
    //     heure[i].innerText = `${heureIncr} h`
    //   }
    // }

    // // temperatures par tranche de 1h
    // for (let j = 0; j < temperatureHeures.length; j++) {
    //   temperatureHeures[j].innerText = `${Math.trunc(
    //     weatherData.hourly[j * 1].temp
    //   )}°`
    // }

    // // Trois premieres lettres des jours
    // for (let k = 0; k < tabJoursEnOdre.length - 1; k++) {
    //   //console.log(k, joursDiv[k]);
    //   joursDiv[k].innerText = tabJoursEnOdre[k].slice(0, 3)
    // }

    // //Temp par jours

    // for (let m = 0; m < 6; m++) {
    //   //console.log(tempJoursDiv[m]);
    //   tempJoursDiv[m].innerText = `${Math.trunc(
    //     weatherData.daily[m + 1].temp.day
    //   )}°`
    // }

    // // Icon meteo dynamique

    // if (heureActuelle >= 6 && heureActuelle < 21) {
    //   imgIcone.src = `./ressources/jour/${weatherData.current.weather[0].icon}.svg`
    // } else {
    //   imgIcone.src = `./ressources/nuit/${weatherData.current.weather[0].icon}.svg`
    // }

    // // Icon meteo dynamique par heure

    // if (heureActuelle >= 6 && heureActuelle < 21) {
    //   imgIconesHours.src = `./ressources/jour/${weatherData.hourly.weather[0].icon}.svg`
    // } else {
    //   imgIconesHours.src = `./ressources/nuit/${weatherData.hourly.weather[0].icon}.svg`
    // }

    // // Icon meteo dynamique par jours

    // if (heureActuelle >= 6 && heureActuelle < 21) {
    //   imgIconesDaily.src = `./ressources/jour/${weatherData.daily.weather[0].icon}.svg`
    // } else {
    //   imgIconesDaily.src = `./ressources/nuit/${weatherData.daily.weather[0].icon}.svg`
    // }
    console.log(templateClone);
    main.replaceChildren(templateClone);

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
