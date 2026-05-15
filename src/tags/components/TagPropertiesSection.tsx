import {
  Accordion,
  ColorInput,
  Group,
  NumberInput,
  Select,
} from "@mantine/core";
import {
  IconAdjustments,
  IconBolt,
  IconClock,
  IconHourglass,
  IconPalette,
} from "@tabler/icons-react";

import type { TagFormValues } from "@/tags/models/tagForm";
import type { UseFormReturnType } from "@mantine/form";
import { useState } from "react";

interface Props {
  form: UseFormReturnType<TagFormValues>;
}

const ACCORDION_VALUE = "properties";

export function TagPropertiesSection({ form }: Props) {
  const [answerMode, setAnswerMode] = useState(form.getValues().answerMode);
  const [color, setColor] = useState(form.getValues().color);
  form.watch("answerMode", ({ value }) => setAnswerMode(value));
  form.watch("color", ({ value }) => setColor(value));

  return (
    <Accordion.Item value={ACCORDION_VALUE}>
      <Accordion.Control icon={<IconAdjustments size={16} />}>
        Properties
      </Accordion.Control>
      <Accordion.Panel>
        <Group grow>
          <ColorInput
            label="Color"
            leftSection={<IconPalette size={16} color={color} />}
            key={form.key("color")}
            {...form.getInputProps("color")}
          />
          <Select
            label="Answer mode"
            leftSection={
              answerMode === "immediately" ? (
                <IconBolt size={16} />
              ) : (
                <IconClock size={16} />
              )
            }
            key={form.key("answerMode")}
            {...form.getInputProps("answerMode")}
            data={[
              { value: "timeblock", label: "Timeblock" },
              { value: "immediately", label: "Immediately" },
            ]}
          />
        </Group>
        {answerMode === "immediately" && (
          <Group grow mt="sm">
            <NumberInput
              label="Response time"
              min={1}
              leftSection={<IconHourglass size={16} />}
              key={form.key("responseValue")}
              {...form.getInputProps("responseValue")}
            />
            <Select
              label="Unit"
              key={form.key("responseUnit")}
              {...form.getInputProps("responseUnit")}
              data={[
                { value: "minutes", label: "Minutes" },
                { value: "hours", label: "Hours" },
              ]}
            />
          </Group>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}
