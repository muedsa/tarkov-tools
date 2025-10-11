import Tooltip from "@/app/_components/tooltip";
import { handleTarkovDevImageLink } from "@/uitls/image-util";
import Image from "next/image";

export default function TaskItemImage({ item }: { item: TarkovItem }) {
  return (
    <Tooltip key={item.id} content={item.name}>
      <div className="size-[64]">
        <div className="text-white text-xs absolute top-1 right-1 text-right text-shadow-lg text-nowrap text-clip">
          {item.shortName}
        </div>
        <Image
          src={handleTarkovDevImageLink(item.iconLink)}
          alt={item.name}
          width={64}
          height={64}
        />
      </div>
    </Tooltip>
  );
}
