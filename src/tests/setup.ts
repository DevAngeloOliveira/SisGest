import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock do IntersectionObserver
const intersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
}));

Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: intersectionObserverMock,
});

// Mock do ResizeObserver
const resizeObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
}));

Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: resizeObserverMock,
});

// Limpa todos os mocks após cada teste
afterEach(() => {
    vi.clearAllMocks();
}); 