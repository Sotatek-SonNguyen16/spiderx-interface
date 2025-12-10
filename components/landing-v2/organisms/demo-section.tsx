import Image from 'next/image';

export default function DemoSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Works while you work
          </h2>
          <p className="text-xl text-gray-600">SpiderX sidebar captures tasks automatically while you work</p>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200">
          <Image
            src="/images/cover.png"
            alt="Gmail + SpiderX demo screenshot"
            fill
            sizes="(min-width: 1280px) 1120px, 100vw"
            className="object-contain p-2 md:p-4"
            priority
          />
        </div>
      </div>
    </section>
  );
}

