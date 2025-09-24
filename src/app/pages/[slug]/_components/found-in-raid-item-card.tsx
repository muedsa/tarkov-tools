"use client";

import Image from "next/image";
import FoundInRaidItemTag from "./found-in-raid-item-tag";
import { useEffect, useState } from "react";
import { useUserDataContext } from "./user-data-context";

export type FoundInRaidItemCardProps = {
  data: FoundInRaidItemData;
};

const FoundInRaidItemCard = ({ data }: FoundInRaidItemCardProps) => {
  const userDataContext = useUserDataContext();
  const [requiredCount, setRequiredCount] = useState(0);
  const [taskItems, setTaskItems] = useState<TraderTaskData[]>(
    data.tasks ?? []
  );
  const [completedTaskItems, setCompletedTaskItems] = useState<
    TraderTaskData[]
  >([]);
  const [hideoutStationItems, setHideoutStationItems] = useState<
    HideoutStationData[]
  >([]);
  const [completedHideoutStationItems, setCompletedHideoutStationItems] =
    useState<HideoutStationData[]>(data.hideoutStations ?? []);
  const [collectedCount, setCollectedCount] = useState(0);

  useEffect(() => {
    if (!userDataContext.userData.loading) {
      if (
        typeof userDataContext.userData.collectedItems[data.id] !== "undefined"
      ) {
        setCollectedCount(userDataContext.userData.collectedItems[data.id]);
      }

      let tempRequiredCount: number = 0;
      const tempTaskItems: TraderTaskData[] = [];
      const tempCompletedTaskItems: TraderTaskData[] = [];
      data.tasks?.forEach((t) => {
        if (
          userDataContext.userData.completedTasks &&
          userDataContext.userData.completedTasks.indexOf(t.id) > -1
        ) {
          tempCompletedTaskItems.push(t);
        } else {
          tempTaskItems.push(t);
          tempRequiredCount += t.count;
        }
      });
      const tempHideoutStationItems: HideoutStationData[] = [];
      const tempCompletedHideoutStationItems: HideoutStationData[] = [];
      data.hideoutStations?.forEach((s) => {
        const level =
          userDataContext.userData.completedHideoutStations[s.stationId] ?? 0;
        if (level > s.level) {
          tempCompletedHideoutStationItems.push(s);
        } else {
          tempHideoutStationItems.push(s);
          tempRequiredCount += s.count;
        }
      });
      setRequiredCount(tempRequiredCount);
      setTaskItems(tempTaskItems);
      setCompletedTaskItems(tempCompletedTaskItems);
      setHideoutStationItems(tempHideoutStationItems);
      setCompletedHideoutStationItems(tempCompletedHideoutStationItems);
    }
  }, [data, userDataContext.userData]);

  const hanleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target.value;
    if (/\d+/.test(strValue)) {
      const newCount = parseInt(strValue);
      setCollectedCount(newCount);
      // userDataContext.changeCollectedItem(data.id, collectedCount);
    } else {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`${
        collectedCount >= requiredCount ? "outline-green" : ""
      } flex items-center gap-x-4 p-2 shadow-lg outline-2`}
    >
      <Image
        src={`/tarkov/images/${data.iconLink}`}
        alt={data.name}
        width={64}
        height={64}
      />
      <div className="grow">
        <a className="text-lg w-full" href={data.wikiLink} target="_blank">
          {data.name}
        </a>
        <div>
          <input
            className={`${
              collectedCount >= requiredCount
                ? "border-green"
                : "border-gold-two"
            } border rounded-md p-1 w-12 text-center`}
            type="number"
            name={`foundInRaidItemCount-${data.id}`}
            value={collectedCount}
            onChange={hanleInputChange}
            onBlur={() =>
              userDataContext.changeCollectedItem(data.id, collectedCount)
            }
            min="0"
          />{" "}
          / {requiredCount}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {taskItems.length > 0 &&
            taskItems.map((task) => (
              <FoundInRaidItemTag
                key={task.id}
                imageLink={`/tarkov/images/${task.traderImageLink}`}
                primeryText={task.name}
                secondaryText={`${task.count}`}
                completed={false}
                onClick={() => {
                  userDataContext.addCompletedTask(task.id);
                }}
              />
            ))}
          {completedTaskItems.length > 0 &&
            completedTaskItems.map((task) => (
              <FoundInRaidItemTag
                key={task.id}
                imageLink={`/tarkov/images/${task.traderImageLink}`}
                primeryText={task.name}
                secondaryText={`${task.count}`}
                completed={true}
                onClick={() => {
                  userDataContext.removeCompletedTask(task.id);
                  //handleBlurChange();
                }}
              />
            ))}
          {hideoutStationItems.length > 0 &&
            hideoutStationItems.map((station) => (
              <FoundInRaidItemTag
                key={`${station.id}-${station.level}`}
                imageLink={`/tarkov/images/${station.imageLink}`}
                primeryText={`${station.name} Lv.${station.level}`}
                secondaryText={`${station.count}`}
                completed={false}
                onClick={() => {
                  userDataContext.changeHideoutStationLevel(
                    station.stationId,
                    station.level - 1
                  );
                }}
              />
            ))}
          {completedHideoutStationItems.length > 0 &&
            completedHideoutStationItems.map((station) => (
              <FoundInRaidItemTag
                key={`${station.id}-${station.level}`}
                imageLink={`/tarkov/images/${station.imageLink}`}
                primeryText={`${station.name} Lv.${station.level}`}
                secondaryText={`${station.count}`}
                completed={false}
                onClick={() => {}}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FoundInRaidItemCard;
