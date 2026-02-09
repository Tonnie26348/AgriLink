import { Bot, TrendingUp, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const AIInsights = () => {
  const insights = [
    {
      icon: TrendingUp,
      title: "Price Ranges",
      description: "Get AI-suggested price ranges (minimum and maximum) based on historical market data and seasonal patterns.",
      sample: "Tomatoes: ₹40-50/kg (suggested range for current season)",
    },
    {
      icon: Target,
      title: "Demand Indicators",
      description: "See real-time demand levels (High, Medium, Low) to make informed pricing decisions.",
      sample: "Tomatoes: High demand | Market price within range",
    },
    {
      icon: Calendar,
      title: "Market Transparency",
      description: "Access historical trend data and regional pricing patterns to reduce exploitation and improve fair pricing.",
      sample: "Transparent pricing helps you negotiate confidently",
    },
  ];

  return (
    <section id="ai-insights" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <Bot className="w-4 h-4" />
              AI-Powered
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Smart Insights,
              <span className="text-primary"> Better Decisions</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our AI analyzes market trends, seasonal patterns, and historical data to provide 
              actionable insights. You stay in control — the AI advises, you decide.
            </p>

            <div className="bg-muted/50 rounded-2xl p-6 border border-border/50 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-foreground font-medium mb-1">How it works:</p>
                  <p className="text-muted-foreground text-sm">
                    The AI module is advisory only — farmers retain full control over their 
                    pricing decisions. As more data is collected, predictions become more accurate.
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" className="shadow-soft">
              Explore AI Features
            </Button>
          </div>

          {/* Right Column - Insight Cards */}
          <div className="space-y-5">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 hover:shadow-elevated transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <insight.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-bold text-foreground mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                      {insight.description}
                    </p>
                    <div className="bg-muted/70 rounded-lg px-4 py-2">
                      <p className="text-sm font-mono text-foreground">
                        {insight.sample}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIInsights;
