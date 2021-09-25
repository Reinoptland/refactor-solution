export function displayLoading() {
  document.getElementById("root").innerHTML = "<h1>Loading</h1>";
}

export function clearPage() {
  document.getElementById("root").innerHTML = "";
}

export function displayError(error) {
  console.log("Uh oh", error.message);
  document.getElementById("root").innerHTML =
    "<h1>Sorry, Elon is busy, try again later</h1>";
}

export function displayCards(launches) {
  launches.forEach((launch) => {
    const root = document.getElementById("root");
    const missionCard = createMissionCard(launch);

    root.appendChild(missionCard);
  });
}

export function createMissionCard(launch) {
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

export function closeDetails() {
  this.parentElement.style.display = "none";
  for (const card of document.getElementsByClassName("container")) {
    card.style.backgroundColor = "";
  }
}
