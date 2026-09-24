"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { navItems, site } from "@/data/site";
import { cn } from "@/lib/cn";
import { scrollToSection } from "@/lib/utilities";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const visibility = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.isIntersecting);
        }
        const current = navItems.find((item) => visibility.get(item.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    for (const item of navItems) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6",
          scrolled || open
            ? "border border-line bg-surface/70 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            : "border border-transparent bg-transparent",
        )}
      >
        <a
          href="#home"
          onClick={(event) => handleNavClick(event, "home")}
          className="group flex items-center gap-3"
          aria-label={`${site.name} — home`}
        >
          <span className="grid size-9 place-items-center rounded-lg border border-accent/50 bg-accent/10 font-mono text-sm font-semibold text-accent transition group-hover:bg-accent/20">
            {site.initials}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-[0.2em] text-ink sm:block">
            RAZIM KHOKHAR
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.id)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 font-mono text-[0.68rem] tracking-[0.22em] transition-colors duration-300",
                    active
                      ? "text-accent"
                      : "text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                      transition={{
                        duration: reduceMotion ? 0 : 0.35,
                        ease: "easeOut",
                      }}
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          ref={menuButtonRef}
          type="button"
          className="grid size-10 place-items-center rounded-lg border border-line text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            className="fixed inset-x-4 top-20 rounded-2xl border border-line bg-surface/95 p-4 backdrop-blur-xl md:hidden"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(event) => handleNavClick(event, item.id)}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 font-mono text-xs tracking-[0.25em] transition",
                        active
                          ? "bg-accent/10 text-accent"
                          : "text-muted hover:bg-white/[0.04] hover:text-ink",
                      )}
                    >
                      {item.label}
                      <span aria-hidden className="text-dim">
                        →
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
