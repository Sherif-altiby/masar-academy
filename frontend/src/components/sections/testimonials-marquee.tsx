import { Quote } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/shared/star-rating";
import { TESTIMONIALS, Testimonial } from "@/data/testimonials";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="w-80 shrink-0 gap-3 p-5 sm:w-96">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-secondary text-sm text-secondary-foreground">
              {testimonial.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{testimonial.level}</p>
          </div>
        </div>
        <Quote className="size-5 shrink-0 text-primary/30" />
      </div>
      <StarRating value={testimonial.rating} size={14} />
      <p className="text-sm leading-relaxed text-muted-foreground">
        {testimonial.quote}
      </p>
    </Card>
  );
}

export function TestimonialsMarquee() {
  const rowOne = TESTIMONIALS.slice(0, 4);
  const rowTwo = TESTIMONIALS.slice(4);

  return (
    <section className="border-t bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-primary">آراء طلابنا</p>
          <h2 className="mt-2 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            تقييمات حقيقية، من طلاب حقيقيين.
          </h2>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <div className="marquee-row group relative overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee-rtl flex w-max gap-4">
            {[...rowOne, ...rowOne].map((testimonial, i) => (
              <TestimonialCard
                key={`${testimonial.id}-${i}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>

        <div className="marquee-row group relative overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee-ltr flex w-max gap-4">
            {[...rowTwo, ...rowTwo].map((testimonial, i) => (
              <TestimonialCard
                key={`${testimonial.id}-${i}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
