import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, DollarSign, Sprout } from "lucide-react";

const featureList = [
  {
    icon: Package,
    title: "Direct Market Access",
    description: "Connect directly with buyers and sellers, cutting out intermediaries to maximize profits for farmers and get fresh produce for buyers."
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Access real-time market data and AI-driven price predictions, ensuring fair and equitable pricing for all transactions."
  },
  {
    icon: Sprout,
    title: "Sustainable Practices",
    description: "Support and promote environmentally friendly farming methods through informed trading decisions and community initiatives."
  }
];

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

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {featureList.map((feature, index) => (
            <div key={index} className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 text-left hover:shadow-elevated transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
