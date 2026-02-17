import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
            <Leaf className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Ready to Transform
            <span className="text-primary"> Your Trade?</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of farmers and buyers already benefiting from transparent 
            pricing, direct connections, and AI-powered market insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="default" size="xl">
              Join as Farmer
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              Join as Buyer
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm">Free to Join</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-secondary rounded-full" />
              <span className="text-sm">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
