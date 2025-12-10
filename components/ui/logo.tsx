import Image from "next/image";
import logo from "@/public/images/logo.svg";

export default function Logo() {
  return (
    <Image src={logo} alt="SpiderX Logo" width={32} height={32} className="rounded-lg inline-flex shrink-0"/>
  );
}
