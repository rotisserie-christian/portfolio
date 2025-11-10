import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => {
  return setTimeout(cb, 16);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Ensure setInterval and clearInterval are available
if (typeof global.setInterval === 'undefined') {
  global.setInterval = (fn, delay) => {
    return setTimeout(fn, delay);
  };
}

if (typeof global.clearInterval === 'undefined') {
  global.clearInterval = (id) => {
    clearTimeout(id);
  };
}

