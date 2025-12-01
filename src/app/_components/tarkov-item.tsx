import Tooltip from "./tooltip";
import { handleTarkovDevImageLink } from "@/uitls/image-util";
import Image from "next/image";
import Link from "next/link";

export default function TarkovItem({
  item,
  foundInRaid = false,
  asTool = false,
}: {
  item: TarkovItem;
  foundInRaid?: boolean;
  asTool?: boolean;
}) {
  return (
    <Tooltip
      key={item.id}
      content={
        <div>
          {item.name}
          {item.wikiLink && (
            <>
              {" "}
              -{" "}
              <Link href={item.wikiLink} className="underline" target="_blank">
                WIKI
              </Link>
            </>
          )}
        </div>
      }
    >
      <div
        className={
          asTool ? "size-[64px] border-1 border-blue-light" : "size-[64px]"
        }
      >
        <div className="w-[56px] overflow-clip text-white text-xs absolute top-1 right-1 text-right text-shadow-lg text-nowrap text-clip">
          {item.shortName}
        </div>
        <Image
          src={handleTarkovDevImageLink(item.iconLink)}
          alt={item.name}
          width={64}
          height={64}
        />
        {foundInRaid && (
          <div className="w-[13.5px] h-[12.5px] absolute bottom-1 right-1">
            <Image
              src={"/tarkov/images/icon-fir.webp"}
              alt={"战局内带出物品"}
              width={27}
              height={25}
            />
          </div>
        )}
      </div>
    </Tooltip>
  );
}
