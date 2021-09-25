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

async function showLaunches() {
  document.getElementById("root").innerHTML = "<h1>Loading</h1>";

  const [error, launches] = await spacexService.getLaunches();

  if (error) {
    console.log("Uh oh", error.message);
    document.getElementById("root").innerHTML =
      "<h1>Sorry, Elon is busy, try again later</h1>";
    return;
  }

  document.getElementById("root").innerHTML = "";

  const launchesThisYear = selectLaunchesFromLastYearWithPatches(launches);

  launchesThisYear.forEach((launch) => {
    const container = document.createElement("div");
    container.classList.add("container");

    const name = document.createElement("h2");
    name.classList.add("mission-name");
    name.innerText = launch.name;
    container.appendChild(name);

    function showDetails() {
      const cards = document.getElementsByClassName("container");
      for (const card of cards) {
        card.style.backgroundColor = "";
      }

      document.getElementById("overlay").style.display = "block";
      document.getElementById("details").innerText = launch.details;
      this.parentElement.style.backgroundColor = "#3836ff";
    }

    const img = document.createElement("img");
    img.src = launch.links.patch.large;
    img.classList.add("mission-patch");
    container.appendChild(img);

    const button = document.createElement("button");
    button.onclick = showDetails;
    button.innerText = "Details";
    button.classList.add("button--details");

    if (!launch.details) {
      button.disabled = true;
    }

    container.appendChild(button);

    document.getElementById("root").appendChild(container);
  });
}

function closeDetails() {
  this.parentElement.style.display = "none";
  for (const card of document.getElementsByClassName("container")) {
    card.style.backgroundColor = "";
  }
}

showLaunches();
document.querySelector(".button--close").onclick = closeDetails;
