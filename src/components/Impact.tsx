import { TrendingUp, Users, Leaf, Globe } from "lucide-react";

const Impact = () => {
  const impacts = [
    {
      icon: TrendingUp,
      stat: "40%",
      label: "Income Increase",
      description: "Average farmer income increase after joining AgriLink",
    },
    {
      icon: Users,
      stat: "10K+",
      label: "Users Connected",
      description: "Farmers and buyers actively trading on the platform",
    },
    {
      icon: Leaf,
      stat: "30%",
      label: "Less Waste",
      description: "Reduction in post-harvest losses through better market access",
    },
    {
      icon: Globe,
      stat: "47",
      label: "Counties",
      description: "Kenyan counties with active AgriLink users",
    },
  ];

  const objectives = [
    "Improve farmer access to reliable markets",
    "Enhance price transparency and decision-making",
    "Reduce reliance on exploitative middlemen",
    "Minimize post-harvest losses",
    "Promote fair and efficient agricultural trade",
  ];

  return (
    <section id="impact" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_white_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_white_0%,_transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground rounded-full text-sm font-semibold mb-4">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Transforming
            <span className="text-secondary"> Agriculture</span>
          </h2>
          <p className="text-lg text-primary-foreground/80">
            AgriLink is more than a platform — it's a movement to empower farmers, 
            create fair markets, and build sustainable food systems.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {impacts.map((impact, index) => (
            <div
              key={index}
              className="text-center p-6 md:p-8 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <impact.icon className="w-7 h-7 text-secondary" />
              </div>
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
                {impact.stat}
              </div>
              <div className="text-primary-foreground font-semibold mb-1">
                {impact.label}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {impact.description}
              </div>
            </div>
          ))}
        </div>

        {/* Objectives */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-display font-bold text-center mb-8">
            Our Objectives
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-primary-foreground/90 text-sm font-medium">
                  {objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
