// Atom primitives recreated from design-reference/design/src/primitives.jsx
// in typed React + Tailwind. Token names match the design handoff README.

import { type ReactNode, type ButtonHTMLAttributes } from "react";

type Tone = "neutral" | "success" | "warn" | "danger" | "info" | "accent" | "mute";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-crust-850 text-crust-200 border-crust-700",
  success: "bg-crystal-600/20 text-crystal-300 border-crystal-600/40",
  warn: "bg-magma-500/15 text-magma-300 border-magma-500/40",
  danger: "bg-ruby-600/20 text-ruby-300 border-ruby-600/40",
  info: "bg-sky-600/20 text-sky-300 border-sky-600/40",
  accent: "bg-magma-500/15 text-magma-400 border-magma-500/40",
  mute: "bg-crust-900 text-crust-500 border-crust-800",
};

const dotClasses: Record<Tone, string> = {
  neutral: "bg-crust-500",
  success: "bg-crystal-500",
  warn: "bg-magma-500",
  danger: "bg-ruby-500",
  info: "bg-sky-500",
  accent: "bg-magma-500",
  mute: "bg-crust-600",
};

export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const variantClasses: Record<NonNullable<BtnProps["variant"]>, string> = {
  primary:
    "bg-magma-500 text-crust-950 shadow-btn-primary hover:bg-magma-400 active:bg-magma-600 font-semibold",
  secondary:
    "bg-crust-850 text-crust-100 border border-crust-700 hover:border-crust-600",
  ghost: "text-crust-300 hover:text-crust-100 hover:bg-crust-850",
  danger: "text-ruby-400 hover:bg-ruby-600/10 hover:text-ruby-300",
  outline:
    "bg-transparent text-crust-100 border border-crust-700 hover:border-crust-600",
};

const sizeClasses: Record<NonNullable<BtnProps["size"]>, string> = {
  sm: "h-[26px] px-2.5 text-[12px]",
  md: "h-[32px] px-3 text-[13px]",
  lg: "h-[38px] px-4 text-[14px]",
};

export function Btn({
  variant = "secondary",
  size = "md",
  iconLeft,
  iconRight,
  className = "",
  children,
  ...rest
}: BtnProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

export function Badge({
  tone = "neutral",
  pulse = false,
  dot = false,
  children,
}: {
  tone?: Tone;
  pulse?: boolean;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-[2px] text-[11px] font-medium ${toneClasses[tone]}`}
    >
      {dot && (
        <span
          className={`size-1.5 rounded-full ${dotClasses[tone]} ${pulse ? "animate-pulse" : ""}`}
        />
      )}
      {children}
    </span>
  );
}

export function StatusDot({ tone = "neutral" }: { tone?: Tone }) {
  return (
    <span className="relative inline-flex">
      <span className={`size-2 rounded-full ${dotClasses[tone]}`} />
      <span className={`absolute inset-0 rounded-full ${dotClasses[tone]} opacity-30 blur-[2px]`} />
    </span>
  );
}

export function HashChip({ value, lead = 6, tail = 4 }: { value: string; lead?: number; tail?: number }) {
  const truncated =
    value.length > lead + tail + 1
      ? `${value.slice(0, lead)}…${value.slice(-tail)}`
      : value;
  return (
    <span className="inline-flex items-center rounded-md border border-crust-800 bg-crust-850 px-1.5 py-[2px] font-mono text-[11px] text-crust-300">
      {truncated}
    </span>
  );
}

export function Card({
  title,
  action,
  className = "",
  children,
}: {
  title?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-[10px] border border-crust-800 bg-crust-900 p-5 ${className}`}>
      {(title || action) && (
        <header className="mb-3.5 flex items-center justify-between">
          {title && <h3 className="text-[15px] font-semibold tracking-tight text-crust-100">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-crust-800 bg-crust-1000 p-3 font-mono text-[12px] leading-relaxed text-crust-200">
      <code>{children}</code>
    </pre>
  );
}

export function UnavailablePanel({
  upstream,
  reason,
  onRetry,
}: {
  upstream: string;
  reason?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border border-crust-800 bg-crust-900 p-4 text-[13px]">
      <Badge tone="warn" dot>
        unavailable
      </Badge>
      <p className="text-crust-300">
        <span className="font-mono text-crust-400">{upstream}</span> is unreachable.
        {reason && <span className="ml-1 text-crust-500">{reason}</span>}
      </p>
      {onRetry && (
        <Btn size="sm" variant="secondary" onClick={onRetry}>
          Retry
        </Btn>
      )}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[18px] items-center rounded border border-crust-700 bg-crust-850 px-1.5 font-mono text-[10.5px] text-crust-300">
      {children}
    </kbd>
  );
}

export function OrogenMark({ className = "size-6" }: { className?: string }) {
  // Concentric-arc + anchor-wedge placeholder per design handoff.
  // Replace with canonical SVG from landing-site when available.
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 12 a9 9 0 0 0 18 0" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
      <path d="M12 3 L14.5 8 L9.5 8 Z" fill="currentColor" />
    </svg>
  );
}
