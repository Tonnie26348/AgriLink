import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    step: 1,
    title: "Register & List",
    description: "Farmers easily create profiles and list their produce with details like type, quantity, and preferred pricing. Buyers register to browse available goods."
  },
  {
    step: 2,
    title: "Connect & Negotiate",
    description: "AI matches buyers with relevant farmers. Users can communicate directly, negotiate prices, and finalize deals transparently within the platform."
  },
  {
    step: 3,
    title: "Secure Transactions",
    description: "AgriLink facilitates secure payment processing and offers logistics support, ensuring smooth and reliable delivery of produce from farm to market."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto text-center">
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

        {/* How It Works Steps */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {steps.map((item, index) => (
            <div key={index} className="relative p-6 rounded-2xl bg-card shadow-soft border border-border/50 text-left transition-all duration-300 hover:shadow-elevated group">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                {item.step}
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3 mt-4">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
