import { render } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render that includes providers if needed
const customRender = (ui, options = {}) => {
  const AllTheProviders = ({ children }) => {
    return children;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from '@testing-library/react';
export { customRender as render };

