import { render, screen } from '@testing-library/react';
import Stats from '../Stats';
import React from 'react';

test('renders Progress Stats heading', () => {
  render(<Stats />);
  const heading = screen.getByText(/Progress Stats/i);
  expect(heading).toBeInTheDocument();
});
