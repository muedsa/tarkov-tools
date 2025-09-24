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
      <input
        type="text"
        name="foundInRaidItemGridSearch"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border-2 border-glod-two"
        placeholder="输入以搜索..."
      />
      <FoundInRaidItemGrid
        title={"任务及藏身处需要的交易物品"}
        items={foundInRaidBarterItems}
        query={deferredSearchQuery}
      />
      <FoundInRaidItemGrid
        title={"任务上交物品"}
        items={foundInRaidTaskItems}
        query={deferredSearchQuery}
      />
    </div>
  );
};

export default FoundInRaidItemPage;
