import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/constants";

export function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-4 block">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Primary point or path you choose — when it's to adapt or stretch, scroll up the feature list.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={`faq-${faq.id}`}
                className="border-0 rounded-2xl px-6 bg-white card-shadow transition-all data-[state=open]:shadow-xl data-[state=open]:shadow-purple-500/10 data-[state=open]:border-purple-100"
              >
                <AccordionTrigger className="font-bold text-left hover:no-underline py-6 text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base font-medium">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
