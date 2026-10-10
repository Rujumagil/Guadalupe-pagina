"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  eventName?: "Lead" | "Contact";
};

export function TrackedLink({ children, eventName = "Lead", onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && typeof window !== "undefined") {
          const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
          fbq?.("track", eventName);
        }
      }}
    >
      {children}
    </a>
  );
}
