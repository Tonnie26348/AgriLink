import { useState, useEffect } from "react";
 import { useNavigate, Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Leaf, Mail, Lock, User, ArrowRight, Tractor, ShoppingBag } from "lucide-react";
 import { useAuth } from "@/contexts/auth-context-definition";
 import { useToast } from "@/hooks/use-toast";
 import { cn } from "@/lib/utils";
 
 type AppRole = "farmer" | "buyer";
 
 const Signup = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [fullName, setFullName] = useState("");
   const [role, setRole] = useState<AppRole | null>(null);
   const [isLoading, setIsLoading] = useState(false);
  const { signUp, userRole } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
 
  // Redirect after successful signup and role assignment (for auto-confirm)
  useEffect(() => {
    if (userRole) {
      const redirectPath = userRole === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard";
      navigate(redirectPath);
    }
  }, [userRole, navigate]);

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!role) {
       toast({
         variant: "destructive",
         title: "Role required",
         description: "Please select whether you're a farmer or buyer.",
       });
       return;
     }
 
     setIsLoading(true);
 
     const { error } = await signUp(email, password, fullName, role);
 
     if (error) {
       toast({
         variant: "destructive",
         title: "Signup failed",
         description: error.message,
       });
     } else {
       toast({
         title: "Account created!",
         description: "Please check your email to verify your account.",
       });
       navigate("/login");
     }
 
     setIsLoading(false);
   };
 
   return (
     <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 pt-16">
       <div className="w-full max-w-md">
                  {/* Signup Card */}         <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border">
           <h1 className="text-2xl font-display font-bold text-foreground text-center mb-2">
             Join AgriLink
           </h1>
           <p className="text-muted-foreground text-center mb-8">
             Create your account to get started
           </p>
 
           <form onSubmit={handleSubmit} className="space-y-6">
             {/* Role Selection */}
             <div className="space-y-3">
               <Label>I am a...</Label>
               <div className="grid grid-cols-2 gap-4">
                 <button
                   type="button"
                   onClick={() => setRole("farmer")}
                   className={cn(
                     "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                     role === "farmer"
                       ? "border-primary bg-primary/10 shadow-soft"
                       : "border-border hover:border-primary/50 hover:bg-muted"
                   )}
                 >
                   <div className={cn(
                     "w-12 h-12 rounded-full flex items-center justify-center",
                     role === "farmer" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                   )}>
                     <Tractor className="w-6 h-6" />
                   </div>
                   <span className={cn(
                     "font-semibold",
                     role === "farmer" ? "text-primary" : "text-foreground"
                   )}>
                     Farmer
                   </span>
                 </button>
 
                 <button
                   type="button"
                   onClick={() => setRole("buyer")}
                   className={cn(
                     "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                     role === "buyer"
                       ? "border-secondary bg-secondary/10 shadow-soft"
                       : "border-border hover:border-secondary/50 hover:bg-muted"
                   )}
                 >
                   <div className={cn(
                     "w-12 h-12 rounded-full flex items-center justify-center",
                     role === "buyer" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                   )}>
                     <ShoppingBag className="w-6 h-6" />
                   </div>
                   <span className={cn(
                     "font-semibold",
                     role === "buyer" ? "text-secondary" : "text-foreground"
                   )}>
                     Buyer
                   </span>
                 </button>
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="fullName">Full Name</Label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                 <Input
                   id="fullName"
                   type="text"
                   placeholder="John Doe"
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   className="pl-10"
                   required
                 />
               </div>
             </div>
 
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
                   minLength={6}
                   required
                 />
               </div>
               <p className="text-xs text-muted-foreground">
                 Password must be at least 6 characters
               </p>
             </div>
 
             <Button 
               type="submit" 
               className="w-full" 
               size="lg"
               disabled={isLoading}
             >
               {isLoading ? "Creating account..." : "Create Account"}
               <ArrowRight className="w-5 h-5" />
             </Button>
           </form>
 
           <p className="text-center text-muted-foreground mt-6">
             Already have an account?{" "}
             <Link to="/login" className="text-primary font-semibold hover:underline">
               Sign in
             </Link>
           </p>
         </div>
       </div>
     </div>
   );
 };
 
 export default Signup;