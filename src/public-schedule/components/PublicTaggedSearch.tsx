import {
  Badge,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

import { usePublicTaggedMessagesQuery } from "@/public-schedule/hooks/queries/usePublicTaggedMessagesQuery";
import type { PublicTaggedMessage } from "@/public-schedule/models/publicTaggedMessage";

interface Props {
  slug: string;
  onSelect: (messageId: string) => void;
}

export function PublicTaggedSearch({ slug, onSelect }: Props) {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 250);
  const { data, isFetching } = usePublicTaggedMessagesQuery(slug, debounced);

  const results = data ?? [];
  const showResults = value.trim().length > 0;

  return (
    <Stack gap={4} pos="relative">
      <TextInput
        size="sm"
        placeholder="Search tagged messages…"
        leftSection={<IconSearch size={16} />}
        rightSection={isFetching ? <Loader size="xs" /> : null}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      {showResults && (
        <Paper
          withBorder
          shadow="sm"
          radius="md"
          p={4}
          pos="absolute"
          top="100%"
          left={0}
          right={0}
          style={{ zIndex: 10, maxHeight: 320, overflowY: "auto" }}
        >
          {results.length === 0 ? (
            <Text size="sm" c="dimmed" p="xs">
              No tagged messages found.
            </Text>
          ) : (
            <Stack gap={2}>
              {results.map((item) => (
                <TaggedSearchResult
                  key={item.messageId}
                  item={item}
                  onSelect={() => {
                    onSelect(item.messageId);
                    setValue("");
                  }}
                />
              ))}
            </Stack>
          )}
        </Paper>
      )}
    </Stack>
  );
}

function TaggedSearchResult({
  item,
  onSelect,
}: {
  item: PublicTaggedMessage;
  onSelect: () => void;
}) {
  return (
    <UnstyledButton onClick={onSelect} p="xs" style={{ borderRadius: 6 }}>
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
          <Badge
            variant="light"
            styles={{ root: { backgroundColor: item.tag.color, color: "#fff" } }}
          >
            {item.tag.name}
          </Badge>
          <Text size="sm" truncate>
            {item.preview}
          </Text>
        </Group>
        <Badge
          variant="light"
          color={item.status === "resolved" ? "green" : "yellow"}
        >
          {item.status}
        </Badge>
      </Group>
    </UnstyledButton>
  );
}
