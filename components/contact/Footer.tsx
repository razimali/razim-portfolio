import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-void">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 font-mono text-[0.65rem] tracking-[0.18em] text-dim uppercase sm:flex-row sm:items-center sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name} — {site.location}
        </p>
        <p className="text-dim/80">Next.js · Three.js · GSAP</p>
        <a
          href="#home"
          className="transition-colors hover:text-accent"
          aria-label="Back to top"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
