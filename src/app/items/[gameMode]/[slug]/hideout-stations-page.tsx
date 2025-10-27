"use client";

import { useState, useEffect } from "react";
import HideoutStationComponent from "./_components/hideout-station";

const HideoutStationsPage = ({ gameMode }: { gameMode: GameMode }) => {
  const [tarkovHideoutStations, setTarkovHideoutStations] = useState<
    TarkovHideoutStation[]
  >([]);

  useEffect(() => {
    fetch(`/tarkov/data/${gameMode}/hideoutStations.json`)
      .then((response) => response.json())
      .then((data) => {
        setTarkovHideoutStations(data.hideoutStations);
      })
      .catch((error) => console.error("Error fetching barter items:", error));
  }, [gameMode]);

  return (
    <div className="bg-gunmetal-dark p-4">
      <div className="text-6xl text-gold-one">
        藏身处
        <span className="align-top p-1 text-white bg-green rounded-xl text-sm">
          {gameMode.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {tarkovHideoutStations.map((s) => (
          <HideoutStationComponent key={s.id} hideoutStation={s} />
        ))}
      </div>
    </div>
  );
};

export default HideoutStationsPage;
