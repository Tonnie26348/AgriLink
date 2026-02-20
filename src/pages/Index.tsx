import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context-definition";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import AIInsights from "@/components/AIInsights";
import Impact from "@/components/Impact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole) {
      const redirectPath = userRole === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [userRole, navigate]);

  return (
    <div className="min-h-screen bg-background">
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
