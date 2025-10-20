import Tooltip from "@/app/_components/tooltip";
import { handleTarkovDevImageLink } from "@/uitls/image-util";
import Image from "next/image";

export default function Achievement({ item }: { item: TarkovAchievement }) {
  return (
    <div className="flex flex-col flex-wrap items-center gap-1">
      <Tooltip key={item.id} content={item.description}>
        <div className="w-[64px] h-[73px]">
          <Image
            src={handleTarkovDevImageLink(item.imageLink)}
            alt={item.name}
            width={64}
            height={73}
          />
        </div>
      </Tooltip>
      <div className="text-xs text-gold-one">{item.name}</div>
    </div>
  );
}
