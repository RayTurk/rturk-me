import '@testing-library/jest-dom';

// jsdom does not implement matchMedia; provide a minimal stub so hooks that
// use window.matchMedia (e.g. useReducedMotion) work in tests.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// jsdom does not implement IntersectionObserver; stub it so Framer Motion's
// whileInView / viewport feature does not throw during unit tests.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverStub,
});
