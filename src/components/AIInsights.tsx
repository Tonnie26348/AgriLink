import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AIInsights = () => {
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

            <Link to="/ai-insights"> {/* Update the button to link to the new AI Insights page */}
              <Button size="lg" className="shadow-soft">
                Explore AI Features
              </Button>
            </Link>
          </div>

          {/* Removed Right Column - Insight Cards */}
        </div>
      </div>
    </section>
  );
};

export default AIInsights;
