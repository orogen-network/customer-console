// AppShell — recreates design-reference/design/src/shell.jsx in typed
// React + Tailwind. Sidebar 220px (collapses to 52px); sticky topbar; active
// nav item shows 2px magma-500 left rail + crust-850 background.

import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { Badge, OrogenMark, StatusDot } from "@/components/primitives";

interface NavItem {
  to: string;
  label: string;
}

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard" },
  { to: "/keys", label: "API Keys" },
  { to: "/usage", label: "Usage" },
  { to: "/billing", label: "Billing" },
  { to: "/team", label: "Team" },
  { to: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { location } = useRouterState();
  const path = location.pathname;

  return (
    <div className="flex min-h-screen">
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-crust-800 bg-crust-900 transition-all ${
          collapsed ? "w-[52px]" : "w-[220px]"
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-3.5">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex size-9 items-center justify-center rounded-md text-crust-300 hover:bg-crust-850 hover:text-crust-100"
            aria-label="Toggle sidebar"
          >
            <OrogenMark className="size-5" />
          </button>
          {!collapsed && (
            <div className="flex flex-1 items-center justify-between">
              <span className="font-display text-[18px] leading-none text-crust-100">Orogen</span>
              <span className="rounded border border-crust-700 bg-crust-850 px-1.5 py-[1px] font-mono text-[9px] uppercase tracking-wider text-crust-400">
                console
              </span>
            </div>
          )}
        </div>

        <nav className="mt-2 flex-1 px-2">
          {NAV.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                  active
                    ? "bg-crust-850 text-crust-100"
                    : "text-crust-400 hover:bg-crust-850/50 hover:text-crust-200"
                }`}
              >
                {active && <span className="absolute left-0 top-1 bottom-1 w-[2px] rounded-r bg-magma-500" />}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <footer className="border-t border-crust-800 px-3 py-3 text-[11px] text-crust-400">
            <div className="flex items-center gap-2">
              <StatusDot tone="success" />
              <span className="font-mono">forge testnet</span>
            </div>
            <div className="mt-1 font-mono text-crust-500">orogen v6 · tx6</div>
          </footer>
        )}
      </aside>

      <main className="flex flex-1 flex-col">
        <Topbar />
        <PreviewNotice />
        <div className="flex-1 px-8 py-6">{children}</div>
      </main>
    </div>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-[52px] items-center justify-between border-b border-crust-800 bg-crust-950/85 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-md border border-crust-800 bg-crust-900 px-2.5 py-1 text-[12px] text-crust-200 hover:border-crust-700">
          <span>Acme AI</span>
          <span className="text-crust-500">▾</span>
        </button>
      </div>
      <div className="flex items-center gap-4 text-[12px]">
        <span className="font-mono text-crust-500">test edge</span>
        <Badge tone="warn" dot>account APIs unavailable</Badge>
        <div className="ml-2 flex size-7 items-center justify-center rounded-full border border-crust-800 bg-crust-850 text-[11px] font-medium text-crust-200">
          JS
        </div>
      </div>
    </header>
  );
}

function PreviewNotice() {
  return (
    <div className="border-b border-magma-500/30 bg-magma-500/10 px-8 py-2.5 text-[12px] text-magma-100">
      <span className="font-mono uppercase tracking-wider text-magma-300">test preview</span>
      <span className="ml-2 text-crust-300">
        Gateway, chain RPC, and indexer are reachable on the test edge. Billing, burn, auth, keys,
        and account usage are not public-live; representative rows are labeled as preview data.
      </span>
    </div>
  );
}
