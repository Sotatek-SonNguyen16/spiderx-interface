import ModalImage from "@/components/modal-image";
import DemoImage from "@/public/images/demo-2.png";

export default function HeroHome() {
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="pb-5 font-heading text-4xl font-semibold text-ink md:text-5xl lg:text-6xl"
              data-aos="fade-up"
            >
              Superhuman for spotting and capturing everything you need to act on
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-ink2"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Stop missing follow-ups. Eliminate scattered tasks across chats, meetings, and emails.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn-primary group mb-4 w-full sm:mb-0 sm:w-auto"
                    href="/contact"
                  >
                    <span className="relative inline-flex items-center">
                      Get Started
                      <span className="ml-1 tracking-normal text-surface/80 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div id="demo">
            <div className="rounded-xl border border-border bg-surface p-2 shadow-s2">
              <ModalImage
                thumb={DemoImage}
                thumbWidth={1104}
                thumbHeight={576}
                thumbAlt="Demo screenshot"
                fullImage={DemoImage}
                fullImageWidth={1104}
                fullImageHeight={576}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
