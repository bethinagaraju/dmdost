import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/constants";
import { getInitials } from "@/utils";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-50/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-2 mb-4">Loved by Thousands of Creators</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From great filters — up to 10x ROI. Here is those to come over are.
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="mb-6 p-8 rounded-3xl bg-white card-shadow break-inside-avoid border border-white/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground text-base leading-relaxed mb-8 font-medium">"{testimonial.content}"</p>
              <div className="flex items-center gap-4">
                <Avatar className="size-12 ring-2 ring-primary/10">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                    {getInitials(testimonial.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                    {testimonial.role} {testimonial.company ? `• ${testimonial.company}` : ''}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
