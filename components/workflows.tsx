import Image from "next/image";
import WorkflowImg01 from "@/public/images/workflow-01.png";
import WorkflowImg02 from "@/public/images/workflow-02.png";
import WorkflowImg03 from "@/public/images/workflow-03.png";
import Spotlight from "@/components/spotlight";

export default function Workflows() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Workflows
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-900),var(--color-brand-600),var(--color-gray-800),var(--color-purple-600),var(--color-gray-900))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Workflows are broken. We fix them.
            </h2>
            <p className="text-lg text-gray-700">
              Busy professionals lose critical follow-ups because work is scattered across Slack, email, and meetings.
            </p>
            <p className="text-lg text-gray-700 mt-3">
              SpiderX runs as a lightweight browser assistant — always present, detecting action items in real time, capturing context, and enriching them with deadlines & priorities.
            </p>
          </div>
          {/* Spotlight items */}
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
            {/* Card 1 */}
            <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white border border-gray-200 p-px shadow-sm hover:shadow-md transition-shadow"
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-white">
                {/* Arrow */}
                <div
                  className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 opacity-0 shadow-sm transition-opacity group-hover/card:opacity-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={9}
                    height={8}
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                    />
                  </svg>
                </div>
                {/* Image */}
                <Image
                  className="inline-flex"
                  src={WorkflowImg01}
                  width={350}
                  height={288}
                  alt="Daily Todo Capture overlay"
                />
                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="btn-sm relative rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-normal border border-indigo-100">
                      <span className="bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                        Daily Todo Capture
                      </span>
                    </span>
                  </div>
                  <p className="text-gray-800">
                    Auto-capture tasks from Slack, email, and meetings — no manual entry.
                    Context is preserved by source, timestamp, and owner.
                  </p>
                </div>
              </div>
            </a>
            {/* Card 2 */}
            <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white border border-gray-200 p-px shadow-sm hover:shadow-md transition-shadow"
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-white">
                {/* Arrow */}
                <div
                  className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 opacity-0 shadow-sm transition-opacity group-hover/card:opacity-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={9}
                    height={8}
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                    />
                  </svg>
                </div>
                {/* Image */}
                <Image
                  className="inline-flex"
                  src={WorkflowImg02}
                  width={350}
                  height={288}
                  alt="AI Prioritize view"
                />
                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="btn-sm relative rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-normal border border-indigo-100">
                      <span className="bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                        AI Prioritize
                      </span>
                    </span>
                  </div>
                  <p className="text-gray-800">
                    Tasks are ranked by urgency & impact with smart deadlines and reminders —
                    so the right work surfaces first.
                  </p>
                </div>
              </div>
            </a>
            {/* Card 3 */}
            <a
              className="group/card relative h-full overflow-hidden rounded-2xl bg-white border border-gray-200 p-px shadow-sm hover:shadow-md transition-shadow"
              href="#0"
            >
              <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-white">
                {/* Arrow */}
                <div
                  className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 opacity-0 shadow-sm transition-opacity group-hover/card:opacity-100"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={9}
                    height={8}
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
                    />
                  </svg>
                </div>
                {/* Image */}
                <Image
                  className="inline-flex"
                  src={WorkflowImg03}
                  width={350}
                  height={288}
                  alt="Team Sync and AI Check-ins"
                />
                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="btn-sm relative rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-normal border border-indigo-100">
                      <span className="bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                        Team Sync & Check-ins
                      </span>
                    </span>
                  </div>
                  <p className="text-gray-800">
                    Share key todos across tools in seconds and get end-of-day AI status reports —
                    zero busywork.
                  </p>
                </div>
              </div>
            </a>
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
