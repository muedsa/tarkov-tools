import GenshinBgStyles from "./genshin-bg.module.css";

const GenshinBg = () => {
  return (
    <div className="m-0 p-0 size-full bg-white">
      <div
        className={`m-0 p-0 size-full ${GenshinBgStyles["genshin-bg"]}`}
      ></div>
    </div>
  );
};

export default GenshinBg;
