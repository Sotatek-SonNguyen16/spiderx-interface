import Link from "next/link";
import { Logo } from "../atoms";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6">
      <div className="flex flex-col items-center justify-center max-w-6xl mx-auto text-center space-y-6">
      <Logo size={32} />
        <p className="text-sm text-brand-600 font-medium hover:text-brand-600 underline"><Link href="https://www.linkedin.com/in/thuyla-business?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank">Contact us on LinkedIn</Link></p>
        <p className="text-gray-600">AI-powered task management</p>
        <p className="text-sm text-gray-500">© 2025 SpiderX. All rights reserved.</p>
      </div>
    </footer>
  );
}
