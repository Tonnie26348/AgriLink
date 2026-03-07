import { Bot, TrendingUp, Calendar, Target, Users, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const insights = [
  {
    icon: TrendingUp,
    title: "Dynamic Price Ranges",
    description: "Get AI-suggested price ranges based on historical market data and seasonal shifts.",
    sample: "Tomatoes: Ksh 40-50/kg",
    color: "primary"
  },
  {
    icon: Target,
    title: "Real-time Demand",
    description: "Instant demand level indicators (High, Medium, Low) to help you time your sales perfectly.",
    sample: "High Demand | Meru Region",
    color: "secondary"
  },
  {
    icon: Calendar,
    title: "Market Transparency",
    description: "Access regional pricing patterns to negotiate with confidence and secure fair value.",
    sample: "Fair Trade Verified",
    color: "accent"
  },
];

const keyMetrics = [
  {
    icon: DollarSign,
    title: "Market Benchmark",
    value: "Ksh 45/kg",
    description: "Optimal price for current season.",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Active Buyers",
    value: "2,847",
    description: "Buyers seeking produce now.",
    color: "text-secondary"
  },
];

const AIInsights = () => {
  return (
    <section id="ai-insights" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column - Sophisticated Content */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Intelligence
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-foreground tracking-tight leading-[1.1]">
                Smart Insights,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                  Better Decisions.
                </span>
              </h2>
            </motion.div>

            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our AI ecosystem analyzes millions of transaction signals and seasonal cycles 
              to provide you with a competitive edge. Transparency meets technology.
            </motion.p>

            <motion.div 
              className="p-1 bg-gradient-to-r from-border/50 to-transparent rounded-[2rem]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white rounded-[1.9rem] p-8 shadow-sm border border-border/20 flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Advisory Intelligence</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    Farmers retain 100% control. The AI module provides high-probability 
                    recommendations based on live market liquidity.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/ai-insights">
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 group">
                  Explore Full Analytics
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Premium Visual Data */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Key Metrics Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {keyMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-premium border border-white/50 ring-1 ring-black/5 flex flex-col items-center text-center group"
                >
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-12
                    ${index === 0 ? 'bg-primary/10' : 'bg-secondary/10'}`}
                  >
                    <metric.icon className={`w-8 h-8
                      ${index === 0 ? 'text-primary' : 'text-secondary'}`} />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">{metric.title}</p>
                  <p className="text-4xl font-display font-black text-foreground mb-2 tracking-tight">{metric.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{metric.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Detailed Insight Cards */}
            <div className="grid gap-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/[0.02] flex flex-col md:flex-row md:items-center gap-8 ring-1 ring-black/[0.03]">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:bg-primary
                      ${insight.color === 'primary' ? 'bg-primary/10' : 
                        insight.color === 'secondary' ? 'bg-secondary/10' : 'bg-accent/10'}`}
                    >
                      <insight.icon className={`w-8 h-8 transition-colors duration-500 group-hover:text-white
                        ${insight.color === 'primary' ? 'text-primary' : 
                          insight.color === 'secondary' ? 'text-secondary' : 'text-accent'}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {insight.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed font-medium">
                        {insight.description}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-2xl px-6 py-4 border border-border/50 min-w-[220px]">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1">AI Output</p>
                      <p className="text-sm font-bold text-foreground italic leading-tight">
                        "{insight.sample}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AIInsights;
