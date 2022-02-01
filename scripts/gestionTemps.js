const jourSemaine = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

let ajd = new Date();
let options = { weekday: "long" };
let jourActuel = ajd.toLocaleDateString("fr-FR", options);
console.log(jourActuel, ajd);

jourActuel = jourActuel.charAt(0).toUpperCase(0) + jourActuel.slice(1);

let tabJoursEnOdre = jourSemaine
  .slice(jourSemaine.indexOf(jourActuel))
  .concat(jourSemaine.slice(0, jourSemaine.indexOf(jourActuel)));

export default tabJoursEnOdre;
