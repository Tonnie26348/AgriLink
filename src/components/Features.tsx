import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 text-center">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Everything You Need to
            <span className="text-primary"> Trade Smarter</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            AgriLink provides all the tools farmers and buyers need for transparent, 
            efficient agricultural trade. Explore our comprehensive features designed to maximize your profits.
          </p>
          <Link to="/features">
            <Button size="lg" variant="outline">
              Explore All Features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
