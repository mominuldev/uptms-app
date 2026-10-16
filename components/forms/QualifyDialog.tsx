"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { ArrowLabel } from "@/components/ui/ArrowLabel";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/icons";
import { ConsultationForm } from "./ConsultationForm";

/**
 * The Home hero's button opens the qualification form in a popup. A native
 * modal <dialog> traps focus, closes on Escape and gives focus back to the
 * button; a click on the backdrop closes it too. It fades in and out
 * (.qualify-dialog in app/globals.css). The form (and Turnstile with
 * it) only mounts once the dialog is first opened, then keeps what was typed.
 */
type FormProps = Omit<ComponentProps<typeof ConsultationForm>, "frame" | "titleId">;

interface Props extends FormProps {
  label: string;
  variant?: ButtonVariant;
  className?: string;
}

export function QualifyDialog({ label, variant = "light", className = "", ...form }: Props) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    // Lock the page behind the popup while it is open.
    const unlock = () => document.documentElement.style.removeProperty("overflow");
    element.addEventListener("close", unlock);

    return () => {
      element.removeEventListener("close", unlock);
      unlock();
    };
  }, []);

  const open = () => {
    setMounted(true);
    document.documentElement.style.overflow = "hidden";
    dialog.current?.showModal();
  };

  const close = () => dialog.current?.close();

  const onBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <>
      <Button variant={variant} className={className} aria-haspopup="dialog" onClick={open}>
        <ArrowLabel>{label}</ArrowLabel>
      </Button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClick={onBackdrop}
        className="qualify-dialog m-auto max-h-[calc(100dvh-24px)] w-[calc(100%-24px)] max-w-[680px] overflow-hidden rounded-sheet bg-white p-0 text-ink shadow-[0_24px_64px_rgba(14,48,78,0.28)] backdrop:bg-navy/70 backdrop:backdrop-blur-[2px] md:max-h-[calc(100dvh-48px)]"
      >
        <div className="max-h-[inherit] overflow-y-auto overscroll-contain px-5 pt-6 pb-7 md:px-12 md:pt-10 md:pb-12">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-royal md:top-4 md:right-4"
          >
            <CloseIcon />
          </button>
          {mounted ? <ConsultationForm {...form} frame="bare" titleId={titleId} /> : null}
        </div>
      </dialog>
    </>
  );
}
