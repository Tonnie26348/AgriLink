import { useState, useEffect } from "react";
 import { useNavigate, Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Leaf, Mail, Lock, ArrowRight } from "lucide-react";
 import { useAuth } from "@/contexts/auth-context-definition";
 import { useToast } from "@/hooks/use-toast";
 
 const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isLoading, setIsLoading] = useState(false);
  const { signIn, userRole } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
  // Redirect after successful login based on role
  useEffect(() => {
    if (userRole) {
      const redirectPath = userRole === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard";
      navigate(redirectPath);
    }
  }, [userRole, navigate]);

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     const { error } = await signIn(email, password);
 
     if (error) {
       toast({
         variant: "destructive",
         title: "Login failed",
         description: error.message,
       });
     } else {
       toast({
         title: "Welcome back!",
         description: "You have successfully logged in.",
       });
      // Navigation handled by useEffect watching userRole
     }
 
     setIsLoading(false);
   };
 
   return (
     <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-16">
       <div className="w-full max-w-md">
                  {/* Login Card */}         <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border">
           <h1 className="text-2xl font-display font-bold text-foreground text-center mb-2">
             Welcome Back
           </h1>
           <p className="text-muted-foreground text-center mb-8">
             Sign in to access your account
           </p>
 
           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                 <Input
                   id="email"
                   type="email"
                   placeholder="you@example.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="pl-10"
                   required
                 />
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                 <Input
                   id="password"
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="pl-10"
                   required
                 />
               </div>
             </div>
 
             <Button 
               type="submit" 
               className="w-full" 
               size="lg"
               disabled={isLoading}
             >
               {isLoading ? "Signing in..." : "Sign In"}
               <ArrowRight className="w-5 h-5" />
             </Button>
           </form>
 
           <p className="text-center text-muted-foreground mt-6">
             Don't have an account?{" "}
             <Link to="/signup" className="text-primary font-semibold hover:underline">
               Sign up
             </Link>
           </p>
         </div>
       </div>
     </div>
   );
 };
 
 export default Login;