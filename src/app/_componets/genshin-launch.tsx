import GenshinLaunchStyles from "./genshin-launch.module.css";

const GenshinLaunch = () => {
  return (
    <div className={GenshinLaunchStyles["genshin-launch-bg"]}>
      <div className={GenshinLaunchStyles["genshin-launch-img"]}></div>
    </div>
  );
};

export default GenshinLaunch;
