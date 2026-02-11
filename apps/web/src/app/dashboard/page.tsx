import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  meQueryOptions,
  taskListQueryOptions,
  planListQueryOptions,
} from "@/hooks/api";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(meQueryOptions()),
    queryClient.prefetchQuery(taskListQueryOptions({ status: "active" })),
    queryClient.prefetchQuery(planListQueryOptions({ limit: 1 })),
  ]);

  return (
    <DashboardLayout>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardContent />
      </HydrationBoundary>
    </DashboardLayout>
  );
}
