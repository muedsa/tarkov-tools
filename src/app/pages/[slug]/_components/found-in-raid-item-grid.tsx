import { memo } from "react";
import FoundInRaidItemCard from "./found-in-raid-item-card";

export type FoundInRaidItemGridProps = {
  title: string;
  items: FoundInRaidItemData[];
  query: string;
};

const FoundInRaidItemGrid = memo(function FoundInRaidItemGrid({
  title,
  items,
  query,
}: FoundInRaidItemGridProps) {
  return (
    <div>
      <div className="mb-1 text-4xl">{title}</div>
      <div className="grid grid-cols-3 gap-4">
        {items
          .filter(
            (i) =>
              !query ||
              i.name.indexOf(query) > -1 ||
              i.normalizedName.indexOf(query) > -1
          )
          .map((item) => (
            <FoundInRaidItemCard
              key={`foundInRaidItemGird-${item.id}`}
              data={item}
            />
          ))}
      </div>
    </div>
  );
});

export default FoundInRaidItemGrid;
