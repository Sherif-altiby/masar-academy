import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SubjectsSection } from "@/components/sections/subjects-section";
import { TeachersSection } from "@/components/sections/teachers-section";
import { TestimonialsMarquee } from "@/components/sections/testimonials-marquee";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SubjectsSection />
      <TeachersSection />
      <TestimonialsMarquee />
    </>
  );
}
