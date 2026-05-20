import { describe, it, expect } from "vitest";
import { probe } from "../clients/upstream";

describe("probe", () => {
  it("returns ok when the call resolves", async () => {
    const res = await probe("indexer", async () => ({ height: 12 }));
    expect(res).toEqual({ status: "ok", data: { height: 12 } });
  });

  it("returns unavailable when the call throws", async () => {
    const res = await probe("indexer", async () => {
      throw new Error("ECONNREFUSED");
    });
    expect(res.status).toBe("unavailable");
    if (res.status === "unavailable") {
      expect(res.upstream).toBe("indexer");
      expect(res.reason).toContain("ECONNREFUSED");
    }
  });
});
