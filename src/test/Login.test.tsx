import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "@/pages/Login";
import { AuthProvider } from "@/contexts/AuthContext"; // Assuming AuthProvider is the correct provider

// Mock the useAuth hook
vi.mock("@/contexts/AuthContext", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      signIn: vi.fn(),
      userRole: null,
    }),
  };
});

// Mock the useToast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the Supabase client
vi.mock("@/integrations/supabase/client");

describe("Login Page", () => {
  it("should render the login form", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Check for the main heading
    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();

    // Check for email and password inputs
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check for the sign-in button
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
