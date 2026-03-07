import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProduceCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-sm group rounded-2xl">
      <div className="relative h-52 bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>
        
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 py-3 border-y border-border/40">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 flex-1 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProduceCardSkeleton;
