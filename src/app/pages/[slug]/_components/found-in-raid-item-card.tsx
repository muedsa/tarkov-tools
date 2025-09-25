"use client";

import Image from "next/image";
import FoundInRaidItemTag from "./found-in-raid-item-tag";
import { useEffect, useState } from "react";
import { useUserDataContext } from "./user-data-context";

export type FoundInRaidItemCardProps = {
  data: FoundInRaidItemData;
};

type TaskTag = TraderTaskData & { completed: boolean };
type HideoutStationTag = HideoutStationData & { completed: boolean };

const FoundInRaidItemCard = ({ data }: FoundInRaidItemCardProps) => {
  const userDataContext = useUserDataContext();
  const [requiredCount, setRequiredCount] = useState(
    (data.tasks?.reduce((acc, t) => acc + t.count, 0) ?? 0) +
      (data.hideoutStations?.reduce((acc, s) => acc + s.count, 0) ?? 0)
  );
  const [taskItems, setTaskItems] = useState<TaskTag[]>(
    (data.tasks ?? []).map((i) => {
      return { ...i, completed: false };
    })
  );
  const [hideoutStationItems, setHideoutStationItems] = useState<
    HideoutStationTag[]
  >(
    (data.hideoutStations ?? []).map((i) => {
      return { ...i, completed: false };
    })
  );
  const [collectedCount, setCollectedCount] = useState(0);

  useEffect(() => {
    if (!userDataContext.userData.loading) {
      if (
        typeof userDataContext.userData.collectedItems[data.id] !== "undefined"
      ) {
        setCollectedCount(userDataContext.userData.collectedItems[data.id]);
      }

      let tempRequiredCount: number = 0;
      const tempTaskItems: TaskTag[] = [];
      data.tasks?.forEach((t) => {
        if (
          userDataContext.userData.completedTasks &&
          userDataContext.userData.completedTasks.indexOf(t.id) > -1
        ) {
          tempTaskItems.push({ ...t, completed: true });
        } else {
          tempTaskItems.push({ ...t, completed: false });
          tempRequiredCount += t.count;
        }
      });
      const tempHideoutStationItems: HideoutStationTag[] = [];
      data.hideoutStations?.forEach((s) => {
        const level =
          userDataContext.userData.completedHideoutStations[s.stationId] ?? 0;
        if (level >= s.level) {
          tempHideoutStationItems.push({ ...s, completed: true });
        } else {
          tempHideoutStationItems.push({ ...s, completed: false });
          tempRequiredCount += s.count;
        }
      });
      setRequiredCount(tempRequiredCount);
      setTaskItems(tempTaskItems);
      setHideoutStationItems(tempHideoutStationItems);
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

  if (userDataContext.userData.loading) {
    return <div>loading...</div>;
  }

  return (
    <div
      className={`${
        collectedCount >= requiredCount ? "border-r-8 border-green" : ""
      } flex items-center gap-x-4 p-2 shadow-lg border-2`}
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
                primeryText={`${task.kappaRequired ? "⁽ᴷ⁾" : ""}${task.name}`}
                secondaryText={`${task.count}`}
                completed={task.completed}
                onClick={() => {
                  if (task.completed) {
                    userDataContext.removeCompletedTask(task.id);
                  } else {
                    userDataContext.addCompletedTask(task.id);
                  }
                }}
              />
            ))}
          {hideoutStationItems.length > 0 &&
            hideoutStationItems.map((station) => (
              <FoundInRaidItemTag
                key={`${station.id}`}
                imageLink={`/tarkov/images/${station.imageLink}`}
                primeryText={`${station.name} Lv.${station.level}`}
                secondaryText={`${station.count}`}
                completed={station.completed}
                onClick={() => {
                  if (station.completed) {
                    userDataContext.changeHideoutStationLevel(
                      station.stationId,
                      station.level - 1
                    );
                  } else {
                    userDataContext.changeHideoutStationLevel(
                      station.stationId,
                      station.level
                    );
                  }
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FoundInRaidItemCard;
