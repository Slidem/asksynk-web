import { signInGuest } from "@/public-schedule/apis/signInGuest";
import { useGuestSessionHandlers } from "@/public-schedule/hooks/useGuestSession";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

interface Args {
  slug: string;
  displayName: string;
}

export function useSignInGuest() {
  const { setSession } = useGuestSessionHandlers();

  const mutation = useMutation({
    mutationFn: ({ slug, displayName }: Args) =>
      signInGuest(slug, { displayName }),
    onSuccess: (result, variables) => {
      setSession({
        token: result.token,
        guestId: result.guestId,
        displayName: variables.displayName,
        publicViewId: result.publicViewId,
        publicViewOwnerId: result.publicViewOwnerId,
        slug: variables.slug,
        expiresAt: result.expiresAt,
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Could not sign in",
        message: error.message,
      });
    },
  });
  return { signIn: mutation.mutate, isSigningIn: mutation.isPending };
}
