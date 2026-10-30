import { useSession } from "@/auth";
import type { AttentionActor } from "@/attentionItems/models/attentionItem";
import { useThreadsQuery } from "@/messages/hooks/queries/useThreadsQuery";

export interface TaggedMessageSender {
  name: string | null;
  email: string | null;
  image: string | null;
}

export function useTaggedMessageSender(
  actor: AttentionActor | null,
  threadId: string | undefined,
): TaggedMessageSender {
  const { data: session } = useSession();
  const { data: threads } = useThreadsQuery();

  const isOwn = actor?.kind === "user" && actor.id === session?.user?.id;

  if (isOwn) {
    return {
      name: session?.user?.name ?? null,
      email: session?.user?.email ?? null,
      image: session?.user?.image ?? null,
    };
  }

  const thread = threads?.find((t) => t.threadId === threadId);
  if (!thread) {
    return { name: null, email: null, image: null };
  }

  if (thread.other.kind === "user") {
    return {
      name: thread.other.name,
      email: thread.other.email,
      image: thread.other.image,
    };
  }

  return { name: thread.other.displayName, email: null, image: null };
}
