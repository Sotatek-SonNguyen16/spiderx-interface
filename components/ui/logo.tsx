import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.svg";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0" aria-label="SpiderX">
      <Image src={logo} alt="SpiderX Logo" width={32} height={32} className="rounded-lg"/>
    </Link>
  );
}
