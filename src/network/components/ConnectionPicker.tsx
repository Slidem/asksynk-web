import { Avatar, Select } from "@mantine/core";
import type { ComboboxItem, OptionsFilter } from "@mantine/core";
import { useMemo } from "react";

import { UserBadge } from "@/components/UserBadge";
import { getConnectionDisplayName } from "@/lib/connections";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  withAsterisk?: boolean;
  disabled?: boolean;
  size?: string;
  w?: number | string;
}

// Single-select connection picker that shows avatar + name + email per option
// (vs. a name-only Select). Fetches connections internally — React Query
// dedupes by key, so multiple pickers on a page share one request.
export function ConnectionPicker({
  value,
  onChange,
  label,
  placeholder = "Pick a connection",
  withAsterisk,
  disabled,
  size,
  w,
}: Props) {
  const { data: connections = [] } = useNetworkConnectionsQuery();

  const byId = useMemo(
    () => new Map(connections.map((c) => [c.userId, c])),
    [connections],
  );

  const data = useMemo<ComboboxItem[]>(
    () =>
      connections.map((c) => ({
        value: c.userId,
        label: getConnectionDisplayName(c),
      })),
    [connections],
  );

  // Mantine's default filter matches the label only; also match on email.
  const filter: OptionsFilter = ({ options, search }) => {
    const query = search.toLowerCase().trim();
    if (!query) return options;
    return (options as ComboboxItem[]).filter((option) => {
      const email = byId.get(option.value)?.email ?? "";
      return `${option.label} ${email}`.toLowerCase().includes(query);
    });
  };

  const selected = value ? byId.get(value) : undefined;

  return (
    <Select
      label={label}
      placeholder={placeholder}
      withAsterisk={withAsterisk}
      disabled={disabled}
      size={size}
      w={w}
      data={data}
      value={value}
      onChange={onChange}
      searchable
      clearable
      nothingFoundMessage="No connections found"
      filter={filter}
      leftSection={
        selected ? (
          <Avatar
            src={selected.image ?? undefined}
            size={size === "xs" ? 18 : 22}
            radius="xl"
          >
            {getConnectionDisplayName(selected).slice(0, 1).toUpperCase()}
          </Avatar>
        ) : undefined
      }
      renderOption={({ option }) => {
        const connection = byId.get(option.value);
        const name = connection
          ? getConnectionDisplayName(connection)
          : option.label;
        const email = connection?.email;
        return (
          <UserBadge
            variant="full"
            name={name}
            email={email === name ? undefined : email}
            image={connection?.image}
            size="sm"
          />
        );
      }}
    />
  );
}
