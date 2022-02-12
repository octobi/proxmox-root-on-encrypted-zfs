import { requireEnv } from "./os/require-env.ts";

export type Config = {
  VERBOSE: boolean;
  DISK_ENCRYPTION_PASSWORD: string;
  ROOT_PASSWORD: string;
  ROOT_AUTHORIZED_KEYS: string;
  HOSTNAME: string;
  FQDN?: string;
};

export const config: Config = {
  VERBOSE: Deno.env.get("VERBOSE") !== "false",
  DISK_ENCRYPTION_PASSWORD: await requireEnv("DISK_ENCRYPTION_PASSWORD"),
  ROOT_PASSWORD: await requireEnv("ROOT_PASSWORD"),
  ROOT_AUTHORIZED_KEYS: await requireEnv("ROOT_AUTHORIZED_KEYS"),
  HOSTNAME: await requireEnv("HOSTNAME"),
  FQDN: Deno.env.get("FQDN"),
};
