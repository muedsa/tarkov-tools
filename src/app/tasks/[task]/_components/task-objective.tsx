import Image from "next/image";
import Tooltip from "@/app/_components/tooltip";
import { handleTarkovDevImageLink } from "@/uitls/image-util";
import Link from "next/link";

const taskObjectiveItemTypeName: Record<string, string> = {
  findItem: "搜寻",
  giveItem: "上交",
  plantItem: "放置",
};

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
          objective.__typename === "TaskObjectiveShoot" ||
          objective.__typename === "TaskObjectiveUseItem") &&
          ` - 0 / ${objective.count}`}
      </div>
      <div className="p-2 bg-gray-950/30">
        {objective.maps.length > 0 && (
          <div>
            <span className="text-white">地图:</span>{" "}
            {objective.maps.map((m) => m.name).join("、")}
          </div>
        )}
        {objective.__typename === "TaskObjectiveBuildItem" && (
          <div>
            <span className="text-white">构建物品</span>{" "}
            {objective.count > 1 && `X${objective.count}`}
          </div>
        )}
        {objective.__typename === "TaskObjectiveExperience" && (
          <>
            <div>
              <span className="text-white">部位:</span>{" "}
              {objective.healthEffect.bodyParts.join("、")}
            </div>
            <div>
              <span className="text-white">效果:</span>{" "}
              {objective.healthEffect.effects.join("、")}
            </div>
            <div>
              <span className="text-white">时间:</span>{" "}
              {`${objective.healthEffect.time.compareMethod} ${objective.healthEffect.time.value}`}
            </div>
          </>
        )}
        {objective.__typename === "TaskObjectiveExtract" && (
          <div className="text-white">
            以幸存状态撤离
            {objective.count > 1 && ` ${objective.count}次`}
          </div>
        )}
        {objective.__typename === "TaskObjectiveItem" && (
          <div>
            <div className="text-white">
              {taskObjectiveItemTypeName[objective.type] ?? objective.type}
              {objective.items.length > 1 && "(其中任何一个)"}:
            </div>
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
        {objective.__typename === "TaskObjectiveMark" && (
          <div>
            <div className="text-white">使用下面物品标记:</div>
            <div>
              {" "}
              <Tooltip
                key={objective.markerItem.id}
                content={objective.markerItem.name}
              >
                <Image
                  src={handleTarkovDevImageLink(objective.markerItem.iconLink)}
                  alt={objective.markerItem.name}
                  width={64}
                  height={64}
                />
              </Tooltip>
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
        {objective.__typename === "TaskObjectiveShoot" && (
          <div>
            <span className="text-white">目标:</span>{" "}
            {objective.targetNames.join("、")}
          </div>
        )}
        {objective.__typename === "TaskObjectiveSkill" && (
          <div>
            <span className="text-white">{objective.skillLevel.name}:</span>
            {` Lv.${objective.skillLevel.level}`}
          </div>
        )}
        {objective.__typename === "TaskObjectiveTaskStatus" && (
          <>
            <div>
              <span className="text-white">关联任务:</span>{" "}
              <Link
                href={`/tasks/${objective.task.normalizedName}`}
                target="_blank"
              >
                {objective.task.name}
              </Link>
            </div>
            <div>
              <span className="text-white">任务状态:</span>{" "}
              {objective.status.join("、")}
            </div>
          </>
        )}
        {objective.__typename === "TaskObjectiveTraderLevel" && (
          <>
            <div>
              <span className="text-white">商人:</span> {objective.trader.name}
            </div>
            <div>
              <span className="text-white">等级:</span> {objective.level}
            </div>
          </>
        )}
        {objective.__typename === "TaskObjectiveTraderStanding" && (
          <>
            <div>
              <span className="text-white">商人:</span> {objective.trader.name}
            </div>
            <div>
              <span className="text-white">信任度</span>{" "}
              {objective.compareMethod} {objective.value}
            </div>
          </>
        )}
        {objective.__typename === "TaskObjectiveUseItem" && (
          <>
            <div>
              <div className="text-white">
                使用{objective.useAny.length > 1 && "(其中任何一个)"}:
              </div>
              <div className="flex flex-wrap">
                {objective.useAny.map((item) => (
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
            <div>
              <span className="text-white">数量</span> {objective.compareMethod}{" "}
              {objective.count}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
