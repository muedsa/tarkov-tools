const getUserFoundInRadItemRequiredCount = (
  item: FoundInRaidItemData,
  completedTasks: UserCompletedTasks,
  completedHideoutStations: UserCompletedHideoutStations,
) => {
  const tasksCount =
    item.tasks?.reduce((acc, task) => {
      return completedTasks.indexOf(task.id) === -1 ? acc + task.count : acc;
    }, 0) ?? 0;
  const hideoutCount =
    item.hideoutStations?.reduce((acc, station) => {
      const level = completedHideoutStations[station.stationId] ?? 0;
      return level < station.level ? acc + station.count : acc;
    }, 0) ?? 0;
  return tasksCount + hideoutCount;
};

export const sortFoundInRadItems = (
  items: FoundInRaidItemData[],
  userData: UserData,
) =>
  items.sort((a, b) => {
    const aUserCount = userData.collectedItems[a.id] ?? 0;
    const bUserCount = userData.collectedItems[b.id] ?? 0;
    const aUserRequiredCount = getUserFoundInRadItemRequiredCount(
      a,
      userData.completedTasks,
      userData.completedHideoutStations,
    );
    const bUserRequiredCount = getUserFoundInRadItemRequiredCount(
      b,
      userData.completedTasks,
      userData.completedHideoutStations,
    );
    const aCompleted = aUserCount >= aUserRequiredCount;
    const bCompleted = bUserCount >= bUserRequiredCount;
    if (aCompleted === bCompleted) {
      return 0;
    }
    return aCompleted ? 1 : -1;
  });
