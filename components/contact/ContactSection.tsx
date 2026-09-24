import { ArrowUpRight, Mail } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site, socialLinks } from "@/data/site";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-t border-line/60"
    >
      <div className="absolute inset-0 bg-vignette" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-36">
        <Reveal>
          <SectionHeading
            id="contact-title"
            eyebrow="CONTACT"
            title="LET’S BUILD SOMETHING INTELLIGENT."
            description="I’m interested in software development, AI engineering, automation, and opportunities where I can learn, contribute, and build practical technology."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={`mailto:${site.email}`}
            className="group glass inline-flex max-w-full items-center gap-4 rounded-2xl px-6 py-5 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_rgba(56,189,248,0.5)]"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
              <Mail size={18} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[0.6rem] tracking-[0.3em] text-dim uppercase">
                Email
              </span>
              <span className="block truncate font-display text-base font-semibold text-ink transition-colors group-hover:text-accent sm:text-lg">
                {site.email}
              </span>
            </span>
            <ArrowUpRight
              size={18}
              aria-hidden
              className="ml-2 shrink-0 text-dim transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            />
          </a>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="Social profiles">
            {socialLinks.map((link) => {
              const Icon = link.label === "GitHub" ? GithubIcon : LinkedinIcon;

              if (!link.href) {
                return (
                  <li key={link.label}>
                    <span
                      aria-disabled="true"
                      title="Profile link coming soon"
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-line bg-white/[0.02] px-5 py-2.5 font-mono text-[0.65rem] tracking-[0.2em] text-dim uppercase"
                    >
                      <Icon size={14} aria-hidden />
                      {link.label} — coming soon
                    </span>
                  </li>
                );
              }

              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-5 py-2.5 font-mono text-[0.65rem] tracking-[0.2em] text-muted uppercase transition hover:border-accent/50 hover:text-ink"
                  >
                    <Icon size={14} aria-hidden />
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-dim">
            Currently studying {site.education.degree} at {site.education.school} and
            open to internships, collaborations and interesting problems where I can
            keep learning.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
