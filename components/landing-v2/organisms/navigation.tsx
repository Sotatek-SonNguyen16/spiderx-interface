import { Logo } from '../atoms';

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
      </div>
    </nav>
  );
}

