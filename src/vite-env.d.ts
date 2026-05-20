/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly VITE_OROGEN_GATEWAY_URL?: string;
  readonly VITE_OROGEN_BILLING_BRIDGE_URL?: string;
  readonly VITE_OROGEN_BURN_ENGINE_URL?: string;
  readonly VITE_OROGEN_INDEXER_URL?: string;
  readonly VITE_OROGEN_FORGE_RPC_URL?: string;
  readonly VITE_OROGEN_ATTESTATION_EXPLORER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
