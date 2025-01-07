import '@testing-library/jest-dom';

// Mock environment variables
process.env = {
  ...process.env,
  VITE_SUPABASE_URL: 'http://localhost:3000',
  VITE_SUPABASE_ANON_KEY: 'test-key'
};

// Explicitly mock Supabase
jest.mock('@supabase/supabase-js');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});