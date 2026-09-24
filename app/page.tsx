import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/contact/Footer";
import { Hero } from "@/components/hero/Hero";
import { CurrentlyLearning } from "@/components/journey/CurrentlyLearning";
import { JourneySection } from "@/components/journey/JourneySection";
import { Mindset } from "@/components/journey/Mindset";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SkillsSection } from "@/components/skills/SkillsSection";

export default function Home() {
  return (
    <main id="main-content" className="flex-1">
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <JourneySection />
      <CurrentlyLearning />
      <Mindset />
      <ContactSection />
      <Footer />
    </main>
  );
}
