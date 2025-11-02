export default function VersionBadge({ version }: { version: string }) {
  return (
    <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
      {version}
    </div>
  );
}

