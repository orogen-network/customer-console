// Customer console runtime configuration.
//
// Full production builds refuse to start unless all account upstream URLs are
// present. Test-edge preview builds are explicit and keep unavailable account
// upstreams empty instead of pointing them at unrelated services.

export interface RuntimeConfig {
  gatewayUrl: string;
  billingBridgeUrl: string;
  burnEngineUrl: string;
  indexerUrl: string;
  forgeRpcUrl: string;
  attestationExplorerUrl: string;
  testPreview: boolean;
}

const REQUIRED_FULL_PROD_KEYS: ReadonlyArray<keyof RuntimeConfig> = [
  "gatewayUrl",
  "billingBridgeUrl",
  "burnEngineUrl",
  "indexerUrl",
];

const REQUIRED_PREVIEW_KEYS: ReadonlyArray<keyof RuntimeConfig> = [
  "gatewayUrl",
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
    testPreview: import.meta.env.VITE_OROGEN_TEST_PREVIEW === "true",
  };
}

export function loadConfig(): RuntimeConfig {
  const cfg = readEnv();
  if (import.meta.env.PROD) {
    const required = cfg.testPreview ? REQUIRED_PREVIEW_KEYS : REQUIRED_FULL_PROD_KEYS;
    const missing = required.filter((k) => !cfg[k]);
    if (missing.length > 0) {
      throw new Error(
        `customer-console: refusing to start in production without ${missing
          .map((k) => `VITE_OROGEN_${k.replace(/Url$/, "").replace(/([A-Z])/g, "_$1").toUpperCase()}_URL`)
          .join(", ")}`,
      );
    }
    if (!cfg.testPreview && (!cfg.billingBridgeUrl || !cfg.burnEngineUrl)) {
      throw new Error(
        "customer-console: full production requires billing and burn upstream URLs; set VITE_OROGEN_TEST_PREVIEW=true only for the public test-edge preview",
      );
    }
  }
  return cfg;
}

export const config = loadConfig();
