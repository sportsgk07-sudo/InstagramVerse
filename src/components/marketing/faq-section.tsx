"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqItems } from "@/lib/content/faq";

interface FaqSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export function FaqSection({ limit, showViewAll = false }: FaqSectionProps) {
  const items = limit ? faqItems.slice(0, limit) : faqItems;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Everything you need to know about InstagramVerse
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {showViewAll && (
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/faq">View All FAQs</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
