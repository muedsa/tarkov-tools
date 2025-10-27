import TarkovItem from "@/app/_components/tarkov-item";
import Tooltip from "@/app/_components/tooltip";
import { handleTarkovDevImageLink } from "@/uitls/image-util";
import Image from "next/image";
import Link from "next/link";

export default function HideoutStation({
  hideoutStation,
}: {
  hideoutStation: TarkovHideoutStation;
}) {
  return (
    <div>
      <div className="border-2">
        <div className="text-4xl p-2 bg-gray-950/40">{hideoutStation.name}</div>
        <div className="flex flex-col gap-2 border-t-2 divide-y-2 divide-dashed">
          {hideoutStation.levels.map((level) => (
            <div key={level.level} className="p-2">
              <div className="text-2xl">
                {hideoutStation.name} Lv.{level.level}
              </div>
              {level.stationLevelRequirements.length > 0 && (
                <>
                  <div className="text-gold-one">● 藏身处等级需求:</div>
                  <div className="p-2 bg-gray-950/40 flex flex-wrap gap-2">
                    {level.stationLevelRequirements.map(
                      (stationLevelRequirement) => (
                        <div key={stationLevelRequirement.id}>
                          <Tooltip
                            content={stationLevelRequirement.station.name}
                          >
                            <Image
                              width={64}
                              height={64}
                              alt={stationLevelRequirement.station.name}
                              src={handleTarkovDevImageLink(
                                stationLevelRequirement.station.imageLink,
                              )}
                            ></Image>
                          </Tooltip>
                          <div className="text-gold-one text-xs text-center text-nowrap text-clip">
                            Lv. {stationLevelRequirement.level}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </>
              )}
              {level.itemRequirements.length > 0 && (
                <>
                  <div className="text-gold-one">● 物品需求:</div>
                  <div className="p-2 bg-gray-950/40 flex flex-wrap gap-2">
                    {level.itemRequirements.map((itemRequirement) => (
                      <div key={itemRequirement.id}>
                        <TarkovItem item={itemRequirement.item}></TarkovItem>
                        <div className="text-gold-one text-xs text-center text-nowrap text-clip">
                          X{itemRequirement.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {level.traderRequirements.length > 0 && (
                <>
                  <div className="text-gold-one">● 商人等级需求:</div>
                  <div className="p-2 bg-gray-950/40 flex flex-wrap gap-2">
                    {level.traderRequirements.map((traderRequirement) => (
                      <div key={traderRequirement.id}>
                        <Image
                          width={64}
                          height={64}
                          alt={traderRequirement.trader.name}
                          src={handleTarkovDevImageLink(
                            traderRequirement.trader.imageLink,
                          )}
                        ></Image>
                        <div className="text-gold-one text-xs text-center text-nowrap text-clip">
                          Lv. {traderRequirement.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {hideoutStation.crafts.length > 0 && (
          <details className="p-2">
            <summary>制造物品:</summary>
            <div className="divide-y-2 divide-dashed">
              {hideoutStation.crafts.map((craft) => (
                <div key={craft.id} className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {craft.rewardItems.map((rewardItem) => (
                      <div key={rewardItem.item.id}>
                        <TarkovItem item={rewardItem.item} />
                        <div className="text-gold-one text-xs text-center text-nowrap text-clip">
                          X{rewardItem.count}
                        </div>
                      </div>
                    ))}
                    <div className="text-white text-[32px]/[64px]">=</div>
                    {craft.requiredQuestItems.map((requiredQuestItem) => (
                      <div key={requiredQuestItem.id}>
                        <TarkovItem
                          item={{
                            ...requiredQuestItem,
                            types: [],
                            wikiLink: "",
                          }}
                        />
                        <div className="text-gold-one text-xs text-center text-nowrap text-clip"></div>
                      </div>
                    ))}
                    {craft.requiredItems.map((requiredItem) => (
                      <div key={requiredItem.item.id}>
                        <TarkovItem item={requiredItem.item} />
                        <div className="text-gold-one text-xs text-center text-nowrap text-clip">
                          X{requiredItem.count}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="py-2 flex gap-2">
                    <div className="inline-flex rounded-sm shadow-sm h-[16px] items-center gap-x-1 outline pr-1">
                      <div className="flex-shrink-0 size-[16px] rounded-sm">
                        <Image
                          className="rounded-sm"
                          src={handleTarkovDevImageLink(
                            craft.station.imageLink,
                          )}
                          alt={craft.station.name}
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="flex-grow text-xs">
                        {craft.station.name} Lv.{craft.level}
                      </div>
                    </div>
                    {craft.taskUnlock && (
                      <div className="inline-flex rounded-sm shadow-sm h-[16px] items-center gap-x-1 outline pr-1">
                        <div className="flex-shrink-0 size-[16px] rounded-sm">
                          <Image
                            className="rounded-sm"
                            src={handleTarkovDevImageLink(
                              craft.taskUnlock.trader.imageLink,
                            )}
                            alt={craft.taskUnlock.trader.name}
                            width={16}
                            height={16}
                          />
                        </div>
                        <Link
                          className="flex-grow text-xs"
                          href={`/tasks/${craft.taskUnlock.normalizedName}`}
                          target="_blank"
                        >
                          {craft.taskUnlock.name}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
