import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, TrendingUp, DollarSign, Leaf } from "lucide-react"; // Changed Seed to Leaf

const impactMetrics = [
  { icon: Users, value: "10K+", label: "Farmers Empowered" },
  { icon: TrendingUp, value: "40%", label: "Average Income Increase" },
  { icon: DollarSign, value: "50M+", label: "Value Transacted (KES)" },
  { icon: Leaf, value: "20+", label: "Regions Covered" }, // Changed Seed to Leaf
];

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

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-primary-foreground">
          {impactMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <metric.icon className="w-10 h-10 text-secondary mb-3 mx-auto" />
              <div className="text-3xl md:text-4xl font-display font-bold mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
