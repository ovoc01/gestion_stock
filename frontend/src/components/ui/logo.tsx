import { Image } from "@nextui-org/image";

type LogoProps = {
  className?: string;
  width: number;
  height: number;
  logo: "title" | "n-title";
};
export default function Logo({ className, width, height, logo }: LogoProps) {
  return (
    <Image
      className={className}
      height={height}
      src={logo === "title" ? "/Colas.png" : "/image.png"}
      width={width}
    />
  );
}
