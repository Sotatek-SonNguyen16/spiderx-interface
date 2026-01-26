import { Card } from "@/components/ui/card";

const items = [
  { title: "Tasks are scattered", body: "Emails, chats, docs… the real work is spread everywhere." },
  { title: "Important work gets buried", body: "Non-urgent but critical tasks slip through over time." },
  { title: "No consistent structure", body: "Even when you capture tasks, they're missing context and ownership." },
];

export default function Pain() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <h2 className="font-heading text-3xl tracking-[-0.02em] text-ink md:text-4xl">
          Built for multi-context work.
        </h2>
        <p className="mt-3 max-w-2xl text-base text-ink2">
          SpiderX is designed for people who juggle multiple projects—without turning task management into a second job.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((x) => (
            <Card key={x.title} className="p-6">
              <div className="text-lg font-semibold text-ink">{x.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-ink2">{x.body}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
