import Image from "next/image";
import BlurredShape from "@/public/images/blurred-shape.svg";

export default function Cta() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt="Blurred shape"
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="gradient-cta rounded-3xl py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="pb-8 font-nacelle text-3xl font-semibold text-white md:text-4xl"
              data-aos="fade-up"
            >
              Make execution effortless.
            </h2>
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <div data-aos="fade-up" data-aos-delay={400}>
                <a
                  className="btn-accent group mb-4 w-full sm:mb-0 sm:w-auto"
                  href="/contact"
                >
                  <span className="relative inline-flex items-center">
                    Join Early Access
                    <span className="ml-1 tracking-normal text-black/70 transition-transform group-hover:translate-x-0.5">
                      -&gt;
                    </span>
                  </span>
                </a>
              </div>
              <div data-aos="fade-up" data-aos-delay={600}>
                <a
                  className="btn relative w-full bg-white text-ink ring-1 ring-black/10 hover:ring-black/20 sm:ml-4 sm:w-auto"
                  href="/install"
                >
                  Install Extension
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
