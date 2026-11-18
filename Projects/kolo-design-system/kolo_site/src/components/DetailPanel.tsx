"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { CloseIcon } from "./ui";

interface Props {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  media?: ReactNode;
  children: ReactNode;
}

/**
 * Modal side drawer built on <dialog>: the browser traps focus and makes the page inert,
 * Esc closes it, and focus returns to whatever opened it.
 */
export function DetailPanel({ open, onClose, eyebrow, title, media, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dlg.showModal();
      if (!prefersReducedMotion()) gsap.fromTo(dlg, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: "power3.out" });
    } else if (!open && dlg.open) {
      const finish = () => {
        dlg.close();
        gsap.set(dlg, { clearProps: "transform" });
        opener.current?.focus();
      };
      if (prefersReducedMotion()) finish();
      else gsap.to(dlg, { xPercent: 100, duration: 0.35, ease: "power2.in", onComplete: finish });
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="panel"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="flex h-full flex-col gap-6 overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          {media}
          <button type="button" onClick={onClose} aria-label="Close" className="ml-auto flex size-11 items-center justify-center rounded-full border-[1.5px] border-stone bg-card text-indigo hover:border-indigo">
            <CloseIcon />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h2 id={titleId} className="m-0 text-3xl font-extrabold leading-tight tracking-[-0.02em] text-indigo">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </dialog>
  );
}
