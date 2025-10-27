import Tooltip from "./tooltip";
import { handleTarkovDevImageLink } from "@/uitls/image-util";
import Image from "next/image";
import Link from "next/link";

export default function TarkovItem({ item }: { item: TarkovItem }) {
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
      <div className="size-[64px]">
        <div className="w-[56px] overflow-clip text-white text-xs absolute top-1 right-1 text-right text-shadow-lg text-nowrap text-clip">
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
