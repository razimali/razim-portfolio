"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";

import { site } from "@/data/site";
import { Button } from "@/components/ui/Button";

export function HeroContent() {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.25 : 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center px-6 pt-28 pb-24 pr-[26%] sm:px-8 sm:pr-8 lg:pt-32 lg:pr-[40%]"
    >
      <motion.p
        variants={item}
        className="mb-5 font-mono text-[0.7rem] tracking-[0.4em] text-accent uppercase"
      >
        {site.location} — {site.education.degree}
      </motion.p>

      <motion.h1
        variants={item}
        className="font-display text-[clamp(2.6rem,8vw,5.75rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-ink"
      >
        RAZIM{" "}
        <span className="block text-transparent [-webkit-text-stroke:1px_rgba(241,245,249,0.55)]">
          KHOKHAR
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-6 max-w-2xl font-display text-xl leading-snug font-medium text-ink text-balance sm:text-2xl md:text-3xl"
      >
        {site.headline}
      </motion.p>

      <motion.p
        variants={item}
        className="mt-4 font-mono text-[0.72rem] tracking-[0.28em] text-accent-2 uppercase sm:text-xs"
      >
        {site.tagline}
      </motion.p>

      <motion.p
        variants={item}
        className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
      >
        {site.description}
      </motion.p>

      <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
        <Button href="#projects">
          VIEW PROJECTS
          <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </Button>
        <Button href="#journey" variant="ghost">
          EXPLORE MY JOURNEY
        </Button>
      </motion.div>

      <motion.a
        variants={item}
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-dim transition-colors hover:text-accent md:flex"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.35em] uppercase">Scroll</span>
        <ArrowDown size={14} aria-hidden className="animate-float-slow" />
      </motion.a>
    </motion.div>
  );
}
