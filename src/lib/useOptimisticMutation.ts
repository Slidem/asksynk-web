import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";

interface UseOptimisticMutationOptions<TData, TVariables> {
  queryKey: QueryKey;
  mutationFn: (variables: TVariables) => Promise<unknown>;
  updater: (oldData: TData | undefined, variables: TVariables) => TData;
  skipInvalidateOnSuccess?: boolean;
}

export function useOptimisticMutation<TData, TVariables>({
  queryKey,
  mutationFn,
  updater,
  skipInvalidateOnSuccess = false,
}: UseOptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<TData>(queryKey);

      queryClient.setQueryData<TData>(queryKey, (oldData) =>
        updater(oldData, variables),
      );

      return { previousData };
    },
    onError: (
      _error: unknown,
      _variables: TVariables,
      context: { previousData?: TData } | undefined,
    ) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {
      if (!skipInvalidateOnSuccess) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
