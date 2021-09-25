import "./style.css";

async function showLaunches(retries) {
  document.getElementById("root").innerHTML = "<h1>Loading</h1>";

  try {
    const response = await fetch("https://api.spacexdata.com/v4/launches");
    const data = await response.json();
    const ONE_YEAR_IN_SECONDS = 2628000 * 12;
    const TODAY_IN_SECONDS = new Date() / 1000;
    const dateLimit = TODAY_IN_SECONDS - ONE_YEAR_IN_SECONDS;
    const launchesThisYear = data
      .filter((launch) => launch.date_unix > dateLimit)
      .sort((a, b) => b.date_unix - a.date_unix);

    document.getElementById("root").innerHTML = "";

    launchesThisYear.forEach((launch) => {
      if (launch.links.patch.large) {
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
      }
    });
  } catch (error) {
    console.log("Uh oh", error.message);
    if (retries > 0) {
      showLaunches(retries - 1);
    } else {
      document.getElementById("root").innerHTML =
        "<h1>Sorry, Elon is busy, try again later</h1>";
    }
  }
}

function closeDetails() {
  this.parentElement.style.display = "none";
  for (const card of document.getElementsByClassName("container")) {
    card.style.backgroundColor = "";
  }
}

showLaunches(3);
document.querySelector(".button--close").onclick = closeDetails;
