import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const stats = [
    { icon: Users, value: "10K+", label: "Farmers Connected" },
    { icon: TrendingUp, value: "40%", label: "Income Increase" },
    { icon: Shield, value: "100%", label: "Transparent Pricing" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 md:py-36 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" 
          alt="Kenyan Farm Landscape" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 animate-fade-in shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-sm font-medium text-white tracking-wide">
              Revolutionizing Agriculture in Kenya
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-8 animate-fade-in delay-100 text-white drop-shadow-sm">
            Connect Farm to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary relative">
              Market Directly
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto animate-fade-in delay-200 leading-relaxed font-light">
            AgriLink eliminates middlemen by bridging farmers and buyers with 
            <span className="font-semibold text-white"> transparent pricing</span>, 
            <span className="font-semibold text-white"> AI-powered insights</span>, and 
            <span className="font-semibold text-white"> secure direct trade</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 animate-fade-in delay-300">
            <Link to="/signup?role=farmer">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-accent hover:bg-accent/90 text-primary-foreground font-bold shadow-elevated hover:scale-105 transition-transform duration-200">
                Start Selling
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm shadow-soft hover:scale-105 transition-transform duration-200">
                Browse Marketplace
                <ChevronRight className="w-5 h-5 ml-1 opacity-70" />
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 animate-fade-in delay-400 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/15 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-white mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-300 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path
            d="M0 100L48 85C96 70 192 40 288 35C384 30 480 50 576 60C672 70 768 70 864 60C960 50 1056 30 1152 25C1248 20 1344 30 1392 35L1440 40V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
