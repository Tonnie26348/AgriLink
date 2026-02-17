import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Shield } from "lucide-react";

const Hero = () => {
  const stats = [
    { icon: Users, value: "10K+", label: "Farmers Connected" },
    { icon: TrendingUp, value: "40%", label: "Income Increase" },
    { icon: Shield, value: "100%", label: "Transparent Pricing" },
  ];

  return (
    <section className="relative min-h-screen flex overflow-hidden pb-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-hero" />

      {/* Content */}
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Text Content */}
          <div className="text-primary-foreground">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Empowering Kenyan Farmers
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 animate-fade-in delay-100 opacity-0">
              Connect Farm to
              <span className="block text-secondary">Market Directly</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-fade-in delay-200 opacity-0">
              AgriLink bridges farmers and buyers with transparent pricing, 
              AI-powered insights, and direct trade — eliminating middlemen 
              and maximizing your profits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in delay-300 opacity-0">
              <Button variant="hero" size="xl">
                Start Selling
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="hero-outline" size="xl">
                Find Produce
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in delay-400 opacity-0">
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <stat.icon className="w-6 h-6 text-secondary mb-2 mx-auto sm:mx-0" />
                  <div className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEW: Right Column - Prominent Visual Placeholder */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in delay-500 opacity-0">
            <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] shadow-elevated border-4 border-card p-6 flex items-center justify-center overflow-hidden">
                {/* Abstract background elements */}
                <div className="absolute w-48 h-48 bg-primary/30 rounded-full -top-12 -left-12 blur-2xl opacity-70" />
                <div className="absolute w-32 h-32 bg-secondary/30 rounded-full -bottom-8 -right-8 blur-2xl opacity-70" />

                                            <div className="text-center relative z-10">
                                                <p className="text-primary-foreground/60 text-[0.6rem]">(Engaging app screenshot or illustration here)</p>
                                            </div>            </div>
          </div>
        </div>
      </div>

      {/* NEW: AgriLink App Coming Soon - Small and Upper Right (Absolute) */}
      <div className="absolute top-4 right-4 z-20 p-2 bg-card/80 backdrop-blur-sm rounded-lg shadow-md text-center hidden md:block">
        <p className="text-muted-foreground text-[10px] font-medium">AgriLink App</p>
        <p className="text-muted-foreground/70 text-[8px]">Coming Soon</p>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
