import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

describe("config", () => {
  it("loads in dev without required env vars", async () => {
    vi.stubEnv("PROD", false);
    vi.stubEnv("VITE_OROGEN_GATEWAY_URL", "");
    await expect(import("../config")).resolves.toBeDefined();
  });

  it("refuses to start in production without all required URLs", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_OROGEN_GATEWAY_URL", "");
    vi.stubEnv("VITE_OROGEN_BILLING_BRIDGE_URL", "");
    vi.stubEnv("VITE_OROGEN_BURN_ENGINE_URL", "");
    vi.stubEnv("VITE_OROGEN_INDEXER_URL", "");
    await expect(import("../config")).rejects.toThrow(/refusing to start in production/);
  });

  it("accepts when all required URLs are present in production", async () => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_OROGEN_GATEWAY_URL", "https://gw.example/");
    vi.stubEnv("VITE_OROGEN_BILLING_BRIDGE_URL", "https://bb.example/");
    vi.stubEnv("VITE_OROGEN_BURN_ENGINE_URL", "https://be.example/");
    vi.stubEnv("VITE_OROGEN_INDEXER_URL", "https://ix.example/");
    await expect(import("../config")).resolves.toBeDefined();
  });
});
