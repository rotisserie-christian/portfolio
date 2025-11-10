import '@testing-library/jest-dom';

/* global global */
global.requestAnimationFrame = (cb) => {
  return setTimeout(cb, 16);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

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

