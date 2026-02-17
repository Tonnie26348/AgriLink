import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Impact = () => {
  return (
    <section id="impact" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_white_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_white_0%,_transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground rounded-full text-sm font-semibold mb-4">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Transforming
            <span className="text-secondary"> Agriculture</span>
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            AgriLink is more than a platform — it's a movement to empower farmers, 
            create fair markets, and build sustainable food systems.
          </p>
          <Link to="/impact">
            <Button size="lg" variant="secondary">
              Discover Our Impact
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Impact;
