import { User, Session } from "@supabase/supabase-js";

export type AppRole = "farmer" | "buyer";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: AppRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: AppRole) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}