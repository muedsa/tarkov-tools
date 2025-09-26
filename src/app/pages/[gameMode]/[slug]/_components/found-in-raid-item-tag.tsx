import Image from "next/image";
import { memo } from "react";

export type FoundInRaidItemTagProps = {
  imageLink: string;
  primeryText: string;
  secondaryText?: string;
  completed: boolean;
  onClick: () => void;
};

const FoundInRaidItemTag = memo(function FoundInRaidItemTag(
  props: FoundInRaidItemTagProps
) {
  return (
    <div
      className="inline-flex rounded-sm shadow-sm h-[16px] items-center gap-x-1 outline"
      onClick={props.onClick}
    >
      <div className="flex-shrink-0 size-[16px] rounded-sm">
        <Image
          className="rounded-sm"
          src={props.imageLink}
          alt={props.primeryText}
          width={16}
          height={16}
        />
      </div>
      <div
        className={`flex-grow text-xs ${props.completed ? "line-through" : ""}`}
      >
        {props.primeryText}
      </div>
      {props?.secondaryText && (
        <div
          className={`flex-shrink-0 text-gold-one text-xs px-1 rounded-sm ${
            props.completed ? "line-through" : ""
          }`}
        >
          {props.secondaryText}
        </div>
      )}
    </div>
  );
});

export default FoundInRaidItemTag;
