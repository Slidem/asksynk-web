import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Menu,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconBell,
  IconBellOff,
  IconBolt,
  IconClock,
  IconClockHour4,
  IconDotsVertical,
  IconPencil,
  IconTag,
  IconTrash,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";

import type { TagDto } from "@/tags/models/tag";
import { formatResponseTime } from "@/tags/utils/responseTime";

interface TagCardProps {
  tag: TagDto;
  onOpen: (tag: TagDto) => void;
  onEdit: (tag: TagDto) => void;
  onDelete: (tag: TagDto) => void;
}

export function TagCard({ tag, onOpen, onEdit, onDelete }: TagCardProps) {
  const answerModeLabel =
    tag.answerMode.type === "immediately" ? "Immediate" : "Timeblock";
  const browserEnabled = tag.notificationsSettings.browserNotificationEnabled;
  const soundEnabled = tag.notificationsSettings.soundNotificationEnabled;

  return (
    <Card
      radius="lg"
      shadow="sm"
      padding="lg"
      withBorder
      style={{ cursor: "pointer" }}
      onClick={() => onOpen(tag)}
    >
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="sm" align="center" wrap="nowrap">
            <ThemeIcon variant="light" color={tag.color} radius="xl" size={40}>
              <IconTag size={20} />
            </ThemeIcon>
            <Text fw={700} size="md">
              {tag.name}
            </Text>
          </Group>

          <Menu position="bottom-end" shadow="md" withinPortal>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={(event) => event.stopPropagation()}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
              <Menu.Item
                leftSection={<IconPencil size={16} />}
                onClick={() => onEdit(tag)}
              >
                Update
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={() => onDelete(tag)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {tag.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {tag.description}
          </Text>
        )}

        <Group gap="sm" wrap="wrap">
          <Badge
            variant="light"
            leftSection={
              tag.answerMode.type === "immediately" ? (
                <IconBolt size={12} />
              ) : (
                <IconClock size={12} />
              )
            }
          >
            {answerModeLabel}
          </Badge>
          {tag.answerMode.type === "immediately" && (
            <Badge variant="light" leftSection={<IconClockHour4 size={12} />}>
              {formatResponseTime(tag.answerMode.responseTimeMillis)}
            </Badge>
          )}
          <Tooltip
            label={
              browserEnabled
                ? "Browser notifications on"
                : "Browser notifications off"
            }
          >
            <ThemeIcon
              variant="light"
              radius="xl"
              size={30}
              color={browserEnabled ? "green" : "gray"}
            >
              {browserEnabled ? (
                <IconBell size={16} />
              ) : (
                <IconBellOff size={16} />
              )}
            </ThemeIcon>
          </Tooltip>
          <Tooltip
            label={soundEnabled ? "Sound alerts on" : "Sound alerts off"}
          >
            <ThemeIcon
              variant="light"
              radius="xl"
              size={30}
              color={soundEnabled ? "green" : "gray"}
            >
              {soundEnabled ? (
                <IconVolume size={16} />
              ) : (
                <IconVolumeOff size={16} />
              )}
            </ThemeIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Card>
  );
}
