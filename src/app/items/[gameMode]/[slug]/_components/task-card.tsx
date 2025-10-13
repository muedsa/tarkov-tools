import Image from "next/image";
import Tooltip from "@/app/_components/tooltip";

const TaskObjectiveItem = ({ data }: { data: GiveItemTaskObjectiveItem }) => {
  return (
    <div>
      <div className="text-gold-one">
        ● {data.description} - 0 / {data.count}
      </div>
      <div className="m-2 p-2 bg-gray-950/40">
        {data.items.length > 1 && (
          <div className="text-white">其中任何一个:</div>
        )}
        <div className="flex flex-wrap">
          {data.items.map((item) => (
            <Tooltip key={item.id} content={item.name}>
              <Image
                src={`/tarkov/images/${item.iconLink}`}
                alt={item.name}
                width={64}
                height={64}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ data }: { data: MixedItemsTraderTaskData }) => {
  return (
    <div className="outline-2 p-2">
      <div className="flex text-3xl">
        <div className="size-[36px]">
          <Image
            src={`/tarkov/images/${data.traderImageLink}`}
            alt={data.trader}
            width={36}
            height={36}
          />
        </div>

        <div className="flex-grow pl-2">{`${data.name}${
          data.kappaRequired ? "⁽ᴷ⁾" : ""
        }`}</div>
      </div>
      <div className="w-full pt-2">
        <Image
          src={`/tarkov/images/${data.taskImageLink}`}
          alt={data.trader}
          width={314}
          height={117}
        />
      </div>
      <div className="w-full pt-2">
        <div>任务需求</div>
        <div>
          {data.objectives.map((objective) => (
            <TaskObjectiveItem key={objective.id} data={objective} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
