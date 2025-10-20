import Tooltip from "@/app/_components/tooltip";
import { handleTarkovDevImageLink } from "@/uitls/image-util";
import Image from "next/image";

export default function HideoutCustomization({
  item,
}: {
  item: TarkovCustomizationItem;
}) {
  return (
    <Tooltip key={item.id} content={item.name}>
      <div className="size-[64px]">
        <Image
          src={handleTarkovDevImageLink(item.imageLink)}
          alt={item.name}
          width={64}
          height={64}
        />
      </div>
    </Tooltip>
  );
}
