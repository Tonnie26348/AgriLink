import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProduceCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>

        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-9 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProduceCardSkeleton;
