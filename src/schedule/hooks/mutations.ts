import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import type {
  CalendarEventInstanceDto,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from "@/schedule/models/calendarEventDto";
import {
  cancelOccurrence,
  createCalendarEvent,
  deleteCalendarEvent,
  detachInstance,
  splitSeries,
  updateCalendarEvent,
} from "./api";
import { useCalendarEventsQueryData } from "./queries";

export function useCreateCalendarEventMutation() {
  const { queryKey } = useCalendarEventsQueryData();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCalendarEventInput) => createCalendarEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

type UpdateEventInput = {
  eventId: string;
  update: UpdateCalendarEventInput;
};

export function useUpdateCalendarEventMutation() {
  const { queryKey } = useCalendarEventsQueryData();
  return useOptimisticMutation<CalendarEventInstanceDto[], UpdateEventInput>({
    queryKey,
    mutationFn: ({ eventId, update }) => updateCalendarEvent(eventId, update),
    updater: (previous, input) => {
      if (!previous) return [];
      return previous.map((dto) => {
        if (dto.eventId !== input.eventId) return dto;
        return {
          ...dto,
          title: input.update.title ?? dto.title,
          description: input.update.description !== undefined ? input.update.description ?? null : dto.description,
          location: input.update.location !== undefined ? input.update.location ?? null : dto.location,
          link: input.update.link !== undefined ? input.update.link ?? null : dto.link,
          color: input.update.color !== undefined ? input.update.color ?? null : dto.color,
          tagIds: input.update.tagIds ?? dto.tagIds,
          rrule: input.update.rrule !== undefined ? input.update.rrule ?? null : dto.rrule,
          instanceStart: input.update.start ?? dto.instanceStart,
          durationSeconds: input.update.durationSeconds ?? dto.durationSeconds,
        };
      });
    },
  });
}

export function useDeleteCalendarEventMutation() {
  const { queryKey } = useCalendarEventsQueryData();
  return useOptimisticMutation<CalendarEventInstanceDto[], string>({
    queryKey,
    mutationFn: (eventId) => deleteCalendarEvent(eventId),
    updater: (previous, eventId) => {
      if (!previous) return [];
      return previous.filter((dto) => dto.eventId !== eventId);
    },
  });
}

type CancelOccurrenceInput = {
  eventId: string;
  occurrenceStart: string;
  instanceId: string;
};

export function useCancelOccurrenceMutation() {
  const { queryKey } = useCalendarEventsQueryData();
  return useOptimisticMutation<CalendarEventInstanceDto[], CancelOccurrenceInput>({
    queryKey,
    mutationFn: ({ eventId, occurrenceStart }) =>
      cancelOccurrence(eventId, occurrenceStart),
    updater: (previous, input) => {
      if (!previous) return [];
      return previous.filter((dto) => dto.instanceId !== input.instanceId);
    },
  });
}

type DetachInstanceInput = {
  eventId: string;
  instanceStart: string;
  dto: UpdateCalendarEventInput;
};

export function useDetachInstanceMutation() {
  const { queryKey } = useCalendarEventsQueryData();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, instanceStart, dto }: DetachInstanceInput) =>
      detachInstance(eventId, instanceStart, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

type SplitSeriesInput = {
  eventId: string;
  splitStart: string;
  dto: UpdateCalendarEventInput;
};

export function useSplitSeriesMutation() {
  const { queryKey } = useCalendarEventsQueryData();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, splitStart, dto }: SplitSeriesInput) =>
      splitSeries(eventId, splitStart, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
