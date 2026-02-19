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

// Mock the CartProvider component entirely to avoid importing it
const MockCartProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Mock the providers
vi.mock("@/contexts/AuthContext", () => ({
  AuthProvider: MockAuthProvider,
}));

vi.mock("@/contexts/CartContext", () => ({
  CartProvider: MockCartProvider,
}));

// Mock the useCart hook
vi.mock("@/contexts/cart-context-definition", () => ({
  useCart: () => ({
    items: [],
    addItem: vi.fn(),
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    getItemCount: () => 0,
    getTotal: () => 0,
    getItemsByFarmer: () => new Map(),
  }),
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
          <MockCartProvider>
            <Login />
          </MockCartProvider>
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
