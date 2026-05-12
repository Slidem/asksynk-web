import type { NetworkConnectionDto } from "@/network/models/networkConnection";

export function getConnectionDisplayName(
  connection: NetworkConnectionDto | null,
) {
  if (!connection) return "User";

  if (connection.name) {
    return connection.name;
  }

  const fullName = [connection.firstName, connection.lastName]
    .filter(Boolean)
    .join(" ");

  if (fullName) {
    return fullName;
  }

  if (connection.email) {
    return connection.email;
  }

  return "User";
}
