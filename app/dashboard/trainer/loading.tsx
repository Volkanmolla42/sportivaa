import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-8">
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-5 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}
