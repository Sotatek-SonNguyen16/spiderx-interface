import { Logo } from '../atoms';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <Logo size={32} />
        <p className="text-gray-600">AI-powered task management</p>
        <p className="text-sm text-gray-500">© 2025 SpiderX. All rights reserved.</p>
      </div>
    </footer>
  );
}

