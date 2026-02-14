 import { createContext, useContext, useEffect, useState, ReactNode } from "react";
 import { User, Session } from "@supabase/supabase-js";
 import { supabase } from "@/integrations/supabase/client";
 import { AppRole, AuthContextType } from "./auth-types";
 
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [userRole, setUserRole] = useState<AppRole | null>(null);
   const [loading, setLoading] = useState(true);
 
   const fetchUserRole = async (userId: string) => {
     const { data, error } = await supabase
       .from("user_roles")
       .select("role")
       .eq("user_id", userId)
       .single();
 
     if (data && !error) {
       setUserRole(data.role as AppRole);
     }
   };
 
   useEffect(() => {
     // Set up auth state listener BEFORE checking session
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
         
         if (session?.user) {
           // Use setTimeout to avoid potential deadlock with Supabase client
           setTimeout(() => fetchUserRole(session.user.id), 0);
         } else {
           setUserRole(null);
         }
         
         setLoading(false);
       }
     );
 
     // Check for existing session
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       if (session?.user) {
         fetchUserRole(session.user.id);
       }
       setLoading(false);
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const signUp = async (email: string, password: string, fullName: string, role: AppRole) => {
     try {
       const { data, error } = await supabase.auth.signUp({
         email,
         password,
         options: {
           emailRedirectTo: window.location.origin,
           data: {
             full_name: fullName,
           },
         },
       });
 
       if (error) throw error;
 
       // If user is created (and auto-confirmed or email confirmation disabled)
       if (data.user) {
         // Insert user role
         const { error: roleError } = await supabase
           .from("user_roles")
           .insert({ user_id: data.user.id, role });
 
         if (roleError) {
           console.error("Error setting user role:", roleError);
         }
       }
 
       return { error: null };
     } catch (error) {
       return { error: error as Error };
     }
   };
 
   const signIn = async (email: string, password: string) => {
     try {
       const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
 
       if (error) throw error;
       return { error: null };
     } catch (error) {
       return { error: error as Error };
     }
   };
 
   const signOut = async () => {
     await supabase.auth.signOut();
     setUser(null);
     setSession(null);
     setUserRole(null);
   };
 
   return (
     <AuthContext.Provider
       value={{ user, session, userRole, loading, signUp, signIn, signOut }}
     >
       {children}
     </AuthContext.Provider>
   );
 };
 
 export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
     throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
 };