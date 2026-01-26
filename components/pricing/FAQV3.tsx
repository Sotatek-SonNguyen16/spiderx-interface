"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const faqs = [
  { q: "What is an AI credit?", a: "1 credit covers a single task extraction or update from a message. Credits reset monthly." },
  { q: "Will SpiderX create duplicates?", a: "Pro+ includes enhanced duplicate prevention, and Queue review lets you accept or skip before tasks enter your list." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel anytime. Your existing tasks remain accessible based on your plan's history retention." },
  { q: "Does SpiderX post messages for me?", a: "No. SpiderX only reads and extracts tasks from connected sources. It never posts without your explicit action." },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-semibold text-ink">{question}</span>
        <ChevronDown className={`h-5 w-5 text-ink3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-sm text-ink2">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQV3() {
  return (
    <section>
      <div className="max-w-2xl">
        <h2 className="font-heading text-3xl tracking-[-0.02em] md:text-4xl">FAQ</h2>
        <p className="mt-3 text-base text-ink2">Short answers, no surprises.</p>
      </div>

      <Card className="mt-8 p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {faqs.map((x) => (
            <FAQItem key={x.q} question={x.q} answer={x.a} />
          ))}
        </div>
      </Card>
    </section>
  );
}
