import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "@/pages/Login";
import React from "react";

// Mock the useAuth hook from the correct definition file
vi.mock("@/contexts/auth-context-definition", () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    userRole: null,
    loading: false,
  }),
}));

// Mock the AuthProvider component entirely to avoid importing it
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Mock the module that exports AuthProvider
vi.mock("@/contexts/AuthContext", () => ({
  AuthProvider: MockAuthProvider,
}));

// Mock the useToast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("Login Page", () => {
  it("should render the login form", () => {
    render(
      <MemoryRouter>
        <MockAuthProvider>
          <Login />
        </MockAuthProvider>
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
