"use client";

import { useState, useEffect, useDeferredValue } from "react";
import FoundInRaidItemGrid from "./_components/found-in-raid-item-grid";

const FoundInRaidItemPage = () => {
  const [foundInRaidBarterItems, setFoundInRaidBarterItems] = useState<
    FoundInRaidItemData[]
  >([]);
  const [foundInRaidTaskItems, setFoundInRaidTaskItems] = useState<
    FoundInRaidItemData[]
  >([]);

  useEffect(() => {
    fetch("/tarkov/data/pve/foundInRaidBarterItems.json")
      .then((response) => response.json())
      .then((data) => setFoundInRaidBarterItems(data))
      .catch((error) => console.error("Error fetching barter items:", error));

    fetch("/tarkov/data/pve/foundInRaidTaskItems.json")
      .then((response) => response.json())
      .then((data) => setFoundInRaidTaskItems(data))
      .catch((error) => console.error("Error fetching task items:", error));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const deferredSearchQuery = useDeferredValue(searchQuery);

  return (
    <div className="bg-gunmetal-dark p-4">
      <div className="text-6xl text-gold-one">战局内带出物品</div>
      <input
        type="text"
        name="foundInRaidItemGridSearch"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border-2 border-glod-two text-2xl p-2 my-2"
        placeholder="输入以搜索..."
      />
      <FoundInRaidItemGrid
        title={"交易物品(藏身处建造与任务需求)"}
        items={foundInRaidBarterItems}
        query={deferredSearchQuery}
      />
      <FoundInRaidItemGrid
        title={"其他物品(任务需求)"}
        items={foundInRaidTaskItems}
        query={deferredSearchQuery}
      />
    </div>
  );
};

export default FoundInRaidItemPage;
