// Customer console runtime configuration.
//
// Production builds refuse to start unless all four upstream URLs are present.
// Subsidy-dashboard pattern: never fake green data — but we have to know who
// to ask before we can label a panel "unavailable" honestly.

export interface RuntimeConfig {
  gatewayUrl: string;
  billingBridgeUrl: string;
  burnEngineUrl: string;
  indexerUrl: string;
  forgeRpcUrl: string;
  attestationExplorerUrl: string;
}

const REQUIRED_PROD_KEYS: ReadonlyArray<keyof RuntimeConfig> = [
  "gatewayUrl",
  "billingBridgeUrl",
  "burnEngineUrl",
  "indexerUrl",
];

function readEnv(): RuntimeConfig {
  return {
    gatewayUrl: import.meta.env.VITE_OROGEN_GATEWAY_URL ?? "",
    billingBridgeUrl: import.meta.env.VITE_OROGEN_BILLING_BRIDGE_URL ?? "",
    burnEngineUrl: import.meta.env.VITE_OROGEN_BURN_ENGINE_URL ?? "",
    indexerUrl:
      import.meta.env.VITE_OROGEN_INDEXER_URL ??
      "https://indexer.orogen.network/graphql",
    forgeRpcUrl:
      import.meta.env.VITE_OROGEN_FORGE_RPC_URL ??
      "https://forge-rpc.orogen.network",
    attestationExplorerUrl:
      import.meta.env.VITE_OROGEN_ATTESTATION_EXPLORER_URL ??
      "https://attestation.orogen.network",
  };
}

export function loadConfig(): RuntimeConfig {
  const cfg = readEnv();
  if (import.meta.env.PROD) {
    const missing = REQUIRED_PROD_KEYS.filter((k) => !cfg[k]);
    if (missing.length > 0) {
      throw new Error(
        `customer-console: refusing to start in production without ${missing
          .map((k) => `VITE_OROGEN_${k.replace(/Url$/, "").replace(/([A-Z])/g, "_$1").toUpperCase()}_URL`)
          .join(", ")}`,
      );
    }
  }
  return cfg;
}

export const config = loadConfig();
