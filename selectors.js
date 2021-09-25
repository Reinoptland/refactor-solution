export function selectLaunchesFromLastYearWithPatches(launches) {
  const ONE_YEAR_IN_SECONDS = 2628000 * 12;
  const TODAY_IN_SECONDS = new Date() / 1000;
  const dateLimit = TODAY_IN_SECONDS - ONE_YEAR_IN_SECONDS;
  return launches
    .filter(
      (launch) => launch.date_unix > dateLimit && launch.links.patch.large
    )
    .sort((a, b) => b.date_unix - a.date_unix);
}
