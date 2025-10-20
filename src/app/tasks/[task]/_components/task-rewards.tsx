import TaskItemImage from "./task-item-image";
import Achievement from "./achievement";
import HideoutCustomization from "./hideout-customization";

export default function TaskRewards({
  experience,
  rewards,
}: {
  experience: number;
  rewards: TarkovTaskRewards;
}) {
  return (
    <div className="p-2">
      {experience > 0 && (
        <div className="text-gold-one">
          ● 经验 <span className="text-white">+{experience}</span>
        </div>
      )}
      {rewards.traderStanding.length > 0 && (
        <div className={experience > 0 ? "mt-2" : ""}>
          <div className="text-gold-one">● 交易商声望奖励:</div>
          <div className="p-2 bg-gray-950/30">
            {rewards.traderStanding.map((standing) => (
              <div key={standing.trader.id}>
                <span className="text-white">{standing.trader.name}</span> +
                {standing.standing}
              </div>
            ))}
          </div>
        </div>
      )}
      {rewards.items.length > 0 && (
        <div className="mt-2">
          <div className="text-gold-one">● 物品奖励:</div>
          <div className="p-2 bg-gray-950/30 flex flex-wrap gap-2">
            {rewards.items.map((containedItem) => (
              <div key={containedItem.item.id}>
                <TaskItemImage item={containedItem.item} />
                <div className="text-gold-one text-xs text-center text-nowrap text-clip">
                  X{containedItem.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {rewards.offerUnlock.length > 0 && (
        <div className="mt-2">
          <div className="text-gold-one">● 解锁物品购买:</div>
          <div className="ml-2 p-2 bg-gray-950/30">
            {rewards.offerUnlock.map((offer) => (
              <div key={offer.id}>
                <div className="text-white">
                  {offer.trader.name} Lv.{offer.level} :
                </div>
                <div className="ml-2">
                  <TaskItemImage item={offer.item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {rewards.craftUnlock.length > 0 && (
        <div className="mt-2">
          <div className="text-gold-one">● 解锁物品制作:</div>
          <div className="p-2 bg-gray-950/30">
            {rewards.craftUnlock.map((craft) => (
              <div key={craft.id}>
                <div className="text-white">
                  {craft.station.name} Lv.{craft.level} :
                </div>
                <div className="ml-2 flex flex-wrap">
                  {craft.rewardItems.map((c) => (
                    <TaskItemImage key={c.item.id} item={c.item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {rewards.skillLevelReward.length > 0 && (
        <div className="mt-2">
          <div className="text-gold-one">● 解锁物品制作:</div>
          <div className="p-2 bg-gray-950/30">
            {rewards.skillLevelReward.map((skillLevelReward) => (
              <div key={skillLevelReward.name}>
                <span className="text-white">{skillLevelReward.name}</span> +
                {skillLevelReward.level}
              </div>
            ))}
          </div>
        </div>
      )}
      {rewards.traderUnlock.length > 0 && (
        <div className="mt-2">
          <div className="text-gold-one">● 解锁商人:</div>
          <div className="p-2 bg-gray-950/30 text-white">
            {rewards.traderUnlock.map((trader) => trader.name).join("、")}
          </div>
        </div>
      )}
      {rewards.achievement.length > 0 && (
        <div className="mt-2">
          <div className="text-gold-one">● 解锁成就:</div>
          <div className="p-2 bg-gray-950/30 flex flex-wrap gap-1">
            {rewards.achievement.map((achievement) => (
              <Achievement key={achievement.id} item={achievement} />
            ))}
          </div>
        </div>
      )}
      {rewards.customization.length > 0 && (
        <div className="mt-2">
          <div className="text-gold-one">● 解锁藏身处自定义:</div>
          <div className="p-2 bg-gray-950/30 flex flex-wrap">
            {rewards.customization.map((customization) => (
              <HideoutCustomization
                key={customization.id}
                item={customization}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
