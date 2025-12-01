import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen grid place-items-center text-center">
      <div>
        <div className="inline-block text-2xl leading-[2] font-medium text-gold-one align-top mr-[20px] pr-[20px] border-r border-r-gold-one">
          404
        </div>
        <div className="inline-block leading-[48px]">这里什么也没有</div>
      </div>
    </div>
  );
}
