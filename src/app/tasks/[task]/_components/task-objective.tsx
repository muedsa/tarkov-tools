import Image from "next/image";
import Tooltip from "@/app/_components/tooltip";
import { handleTarkovDevImageLink } from "@/uitls/image-util";

export default function TaskObjective({
  objective,
}: {
  objective: TarkovTaskObjective;
}) {
  return (
    <div className="p-2">
      <div className="text-gold-one">
        ● {objective.description}
        {(objective.__typename === "TaskObjectiveItem" ||
          objective.__typename === "TaskObjectiveShoot") &&
          ` - 0 / ${objective.count}`}
      </div>
      <div className="p-2 bg-gray-950/30">
        {objective.maps.length > 0 && (
          <div>
            <span className="text-white">地图:</span>{" "}
            {objective.maps.map((m) => m.name).join("、")}
          </div>
        )}
        {objective.__typename === "TaskObjectiveShoot" && (
          <div>
            <span className="text-white">目标:</span>{" "}
            {objective.targetNames.join("、")}
          </div>
        )}
        {objective.__typename === "TaskObjectiveItem" && (
          <div>
            {objective.items.length > 1 && (
              <div className="text-white">其中任何一个:</div>
            )}
            <div className="flex flex-wrap">
              {objective.items.map((item) => (
                <Tooltip key={item.id} content={item.name}>
                  <Image
                    src={handleTarkovDevImageLink(item.iconLink)}
                    alt={item.name}
                    width={64}
                    height={64}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
        )}
        {objective.__typename === "TaskObjectiveQuestItem" && (
          <Tooltip
            key={objective.questItem.id}
            content={objective.questItem.name}
          >
            <Image
              src={handleTarkovDevImageLink(objective.questItem.iconLink)}
              alt={objective.questItem.name}
              width={64}
              height={64}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
}
