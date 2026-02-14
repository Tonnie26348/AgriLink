 import { Navigate, useLocation } from "react-router-dom";
 import { useAuth } from "@/contexts/auth-context-definition";
 
 interface ProtectedRouteProps {
   children: React.ReactNode;
   allowedRoles?: ("farmer" | "buyer")[];
 }
 
 const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
   const { user, userRole, loading } = useAuth();
   const location = useLocation();
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="animate-pulse text-muted-foreground">Loading...</div>
       </div>
     );
   }
 
   if (!user) {
     return <Navigate to="/login" state={{ from: location }} replace />;
   }
 
   if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
     // Redirect to appropriate dashboard based on role
     const redirectPath = userRole === "farmer" ? "/farmer/dashboard" : "/buyer/dashboard";
     return <Navigate to={redirectPath} replace />;
   }
 
   return <>{children}</>;
 };
 
 export default ProtectedRoute;