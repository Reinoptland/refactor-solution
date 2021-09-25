import "./style.css";

import spacexService from "./SpacexService";
import {
  displayCards,
  displayError,
  displayLoading,
  clearPage,
  closeDetails,
} from "./ui-components";
import { selectLaunchesFromLastYearWithPatches } from "./selectors";

async function showLaunches() {
  displayLoading();

  const [error, launches] = await spacexService.getLaunches();

  if (error) return displayError(error);

  clearPage();

  const launchesThisYear = selectLaunchesFromLastYearWithPatches(launches);

  displayCards(launchesThisYear);
}

function start() {
  showLaunches();
  document.querySelector(".button--close").onclick = closeDetails;
}

start();
