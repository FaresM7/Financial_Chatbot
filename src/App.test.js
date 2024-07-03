import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders chat assistant header', async () => {
  await act(async () => {
    render(<App />);
  });
  const headerElement = screen.getByText(/your chat assistant :\)/i);
  expect(headerElement).toBeInTheDocument();
});
