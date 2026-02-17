import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import AIInsights from "@/components/AIInsights";
import Impact from "@/components/Impact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <AIInsights />
      <Impact />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
