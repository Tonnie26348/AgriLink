import "@testing-library/jest-dom";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock Supabase globally for tests
vi.mock("@/integrations/supabase/client", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    supabase: {
      ...actual.supabase,
      auth: {
        ...actual.supabase.auth,
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      },
    },
  };
});
