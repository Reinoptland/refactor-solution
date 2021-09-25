import "./style.css";

class SpacexService {
  constructor(baseUrl, retries = 3) {
    this.baseUrl = baseUrl;
    this.retries = retries;
  }

  async getLaunches(retries = this.retries) {
    try {
      const response = await fetch(`${this.baseUrl}/launches`);
      const data = await response.json();
      return [null, data];
    } catch (error) {
      if (retries > 0) {
        this.getLaunches(retries - 1);
      } else {
        return [error, null];
      }
    }
  }
}

const spacexService = new SpacexService("https://api.spacexdata.com/v4");

function selectLaunchesFromLastYearWithPatches(launches) {
  const ONE_YEAR_IN_SECONDS = 2628000 * 12;
  const TODAY_IN_SECONDS = new Date() / 1000;
  const dateLimit = TODAY_IN_SECONDS - ONE_YEAR_IN_SECONDS;
  return launches
    .filter(
      (launch) => launch.date_unix > dateLimit && launch.links.patch.large
    )
    .sort((a, b) => b.date_unix - a.date_unix);
}

function displayLoading() {
  document.getElementById("root").innerHTML = "<h1>Loading</h1>";
}

function clearPage() {
  document.getElementById("root").innerHTML = "";
}

function displayError(error) {
  console.log("Uh oh", error.message);
  document.getElementById("root").innerHTML =
    "<h1>Sorry, Elon is busy, try again later</h1>";
}

function displayCards(launches) {
  launches.forEach((launch) => {
    const root = document.getElementById("root");
    const missionCard = createMissionCard(launch);

    root.appendChild(missionCard);
  });
}

async function showLaunches() {
  displayLoading();

  const [error, launches] = await spacexService.getLaunches();

  if (error) return displayError(error);

  clearPage();

  const launchesThisYear = selectLaunchesFromLastYearWithPatches(launches);

  displayCards(launchesThisYear);
}

function createMissionCard(launch) {
  const template = document.getElementById("mission-card-template");

  const missionCard = template.content.cloneNode(true);

  function showDetails() {
    const cards = document.getElementsByClassName("container");
    for (const card of cards) {
      card.style.backgroundColor = "";
    }

    document.getElementById("overlay").style.display = "block";
    document.getElementById("details").innerText = launch.details;
    this.parentElement.style.backgroundColor = "#3836ff";
  }

  missionCard.querySelector(".mission-name").innerText = launch.name;
  missionCard.querySelector(".mission-patch").src = launch.links.patch.large;
  const detailsButton = missionCard.querySelector(".button--details");
  detailsButton.onclick = showDetails;
  if (!launch.details) {
    detailsButton.disabled = true;
  }
  return missionCard;
}

function closeDetails() {
  this.parentElement.style.display = "none";
  for (const card of document.getElementsByClassName("container")) {
    card.style.backgroundColor = "";
  }
}

showLaunches();
document.querySelector(".button--close").onclick = closeDetails;
