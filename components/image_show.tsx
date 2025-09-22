import Image from "next/image";
import { cn } from "@/lib/utils";

let imagePrefix: string = "https://directus-example.com/assets/";
export default function ImageShow({ src, alt, width, height, className }: any) {
  if (!src) {
    src = "https://image.com/default.webp";
    // return <div className={'w-[640px] h-[240px]'}></div>
  }

  let url = src;
  if (!src.startsWith("https://") && !src.startsWith("/")) {
    url = imagePrefix + src;
  }

  return (
    <Image
      priority={true}
      src={url}
      alt={alt}
      className={cn("rounded w-full", className)}
      width={width}
      height={height}
    />
  );
}
