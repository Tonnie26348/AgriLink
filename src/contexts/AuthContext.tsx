 import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { User, Session } from "@supabase/supabase-js"; // Supabase removed
// import { supabase } from "@/integrations/supabase/client"; // Supabase removed
 import { AppRole, AuthContextType } from "./auth-types";
 import { AuthContext } from "./auth-context-definition"; // RESTORED AuthContext import
 
// Define AuthContext locally as its import was removed // REMOVED THIS LINE
// export const AuthContext = createContext<AuthContextType | undefined>(undefined); // REMOVED THIS LINE
 
 export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null); // Supabase removed
//   const [session, setSession] = useState<Session | null>(null); // Supabase removed
//   const [userRole, setUserRole] = useState<AppRole | null>(null); // Supabase removed
//   const [loading, setLoading] = useState(true); // Supabase removed

  // Mock states as Supabase is removed, using unknown for types
  const [user, setUser] = useState<unknown | null>(null);
  const [session, setSession] = useState<unknown | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(false); // No loading as no external auth
 
//   const fetchUserRole = async (userId: string) => { // Supabase removed
//     const { data, error } = await supabase
//       .from("user_roles")
//       .select("role")
//       .eq("user_id", userId)
//       .single();
 
//     if (data && !error) {
//       setUserRole(data.role as AppRole);
//     }
//   }; // Supabase removed
 
   useEffect(() => { // Supabase removed
     // Mock useEffect for removed Supabase
     setLoading(false);
   }, []); // Supabase removed
 
   const signUp = async (email: string, password: string, fullName: string, role: AppRole) => { // Supabase removed
     console.warn("Sign up is disabled as Supabase is removed.");
     return { error: new Error("Sign up is currently disabled.") };
   }; // Supabase removed
 
   const signIn = async (email: string, password: string) => { // Supabase removed
     console.warn("Sign in is disabled as Supabase is removed.");
     return { error: new Error("Sign in is currently disabled.") };
   }; // Supabase removed
 
   const signOut = async () => { // Supabase removed
     console.warn("Sign out is disabled as Supabase is removed.");
     setUser(null);
     setSession(null);
     setUserRole(null);
   }; // Supabase removed
 
   return (
     <AuthContext.Provider
       value={{ user, session, userRole, loading, signUp, signIn, signOut }}
     >
       {children}
     </AuthContext.Provider>
   );
 };
 