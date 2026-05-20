// Upstream availability primitives.
//
// Every panel that depends on a live service uses these to surface
// `{ status: 'unavailable', reason }` instead of stale data when the upstream
// is unreachable. Mirrors the subsidy-dashboard pattern shipped in stream C.

export type Upstream =
  | "gateway"
  | "billing-bridge"
  | "burn-engine"
  | "indexer"
  | "forge-rpc"
  | "attestation-explorer";

export type UpstreamResult<T> =
  | { status: "ok"; data: T }
  | { status: "unavailable"; upstream: Upstream; reason: string };

export async function probe<T>(
  upstream: Upstream,
  fn: () => Promise<T>,
): Promise<UpstreamResult<T>> {
  try {
    const data = await fn();
    return { status: "ok", data };
  } catch (err) {
    return {
      status: "unavailable",
      upstream,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}
