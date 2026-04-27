import { apiFetch, buildApiUrl } from "@/lib/api";
import type { NetworkConnectionDto } from "@/network/models/networkConnection";

export async function fetchNetworkConnections(): Promise<
  NetworkConnectionDto[]
> {
  const response = await apiFetch(buildApiUrl("/network"));
  if (!response.ok) throw new Error("Failed to load network");
  return response.json();
}
