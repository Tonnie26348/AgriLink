import { useState, useMemo } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProduceListing } from "@/hooks/useProduceListings";
import { Package, Calendar as CalendarIcon, ChevronRight } from "lucide-react";

interface HarvestCalendarProps {
  listings: ProduceListing[];
}

export const HarvestCalendar = ({ listings }: HarvestCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const harvestDays = useMemo(() => {
    return listings
      .filter((l) => l.harvest_date)
      .map((l) => parseISO(l.harvest_date!));
  }, [listings]);

  const selectedHarvests = useMemo(() => {
    if (!selectedDate) return [];
    return listings.filter((l) =>
      l.harvest_date ? isSameDay(parseISO(l.harvest_date), selectedDate) : false
    );
  }, [listings, selectedDate]);

  const modifiers = {
    harvest: harvestDays,
  };

  const modifierStyles = {
    harvest: {
      fontWeight: "bold",
      backgroundColor: "hsl(var(--primary) / 0.1)",
      color: "hsl(var(--primary))",
      borderRadius: "100%",
    },
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 animate-fade-in">
      <Card className="lg:col-span-5 shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Harvest Timeline</CardTitle>
          <CardDescription>Select a date to view scheduled harvests</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifierStyles}
            className="rounded-xl border shadow-sm bg-card"
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-7 shadow-soft border-border/50">
        <CardHeader className="pb-3 border-b border-border/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
              <CardDescription>
                {selectedHarvests.length} {selectedHarvests.length === 1 ? "harvest" : "harvests"} scheduled
              </CardDescription>
            </div>
            <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-sm">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {selectedHarvests.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h4 className="font-bold text-foreground mb-1">No harvests scheduled</h4>
              <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                Select another date or add a harvest date to your listings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedHarvests.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/20 hover:bg-background transition-all group shadow-sm"
                >
                  {listing.image_url ? (
                    <img
                      src={listing.image_url}
                      alt={listing.name}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-7 h-7 text-primary opacity-60" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {listing.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0 bg-secondary/10 text-secondary border-none">
                        {listing.category}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        {listing.quantity_available} {listing.unit} available
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 rounded-full hover:bg-primary/10 hover:text-primary">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              
              <div className="pt-6 border-t border-dashed border-border/60 mt-6">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                  Tip: Update harvest dates in the Inventory tab
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
