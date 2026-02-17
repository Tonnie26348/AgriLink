import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4 text-center">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Simple Steps to
            <span className="text-primary"> Success</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you're a farmer selling produce or a buyer sourcing fresh goods, 
            AgriLink makes the process seamless. Learn more about how AgriLink empowers you.
          </p>
          <Link to="/how-it-works">
            <Button size="lg" variant="default">
              Discover How It Works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
