import { Quote } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/shared/star-rating";
import { TESTIMONIALS, Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

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

  // Guarantee each row has enough cards to fully tile the track width,
  // regardless of how TESTIMONIALS.length splits.
  const fillRow = (row: Testimonial[], min = 4) =>
    row.length >= min
      ? row
      : Array.from({ length: Math.ceil(min / row.length) })
          .flatMap(() => row)
          .slice(0, Math.max(min, row.length));

  const filledRowOne = fillRow(rowOne);
  const filledRowTwo = fillRow(rowTwo);

  return (
    <section className="border-t bg-secondary/30 py-16 sm:py-20" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ...heading unchanged... */}
      </div>

      <div
        className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_7%,black_93%,transparent)]"
        aria-label="تجارب وآراء الطلاب"
      >
        <span className="sr-only">تجارب وآراء الطلاب</span>

        {/* dir="ltr" here keeps the scroll math correct; cards inside stay dir="rtl" */}
        <div dir="ltr">
          <Marquee pauseOnHover className={cn("[--duration:34s]", "px-0 py-1")}>
            {filledRowOne.map((testimonial, i) => (
              <div dir="rtl" key={`${testimonial.id}-${i}`}>
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className={cn("[--duration:38s]", "px-0 py-1")}>
            {filledRowTwo.map((testimonial, i) => (
              <div dir="rtl" key={`${testimonial.id}-${i}`}>
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </Marquee>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-secondary/30 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-secondary/30 to-transparent" />
      </div>
    </section>
  );
}