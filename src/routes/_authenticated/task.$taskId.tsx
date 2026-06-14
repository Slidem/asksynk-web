import { createFileRoute } from "@tanstack/react-router";

import { TaskDetailPage } from "@/tasks/components/TaskDetailPage";

export const Route = createFileRoute("/_authenticated/task/$taskId")({
  component: TaskDetailRoute,
});

function TaskDetailRoute() {
  const { taskId } = Route.useParams();
  return <TaskDetailPage taskId={taskId} />;
}
