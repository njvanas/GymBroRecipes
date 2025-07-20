import { render, screen } from '@testing-library/react';
import FoodSearch from '../FoodSearch';
import React from 'react';

test('renders Food Search heading', () => {
  render(<FoodSearch onSelect={() => {}} />);
  const heading = screen.getByText(/Food Search/i);
  expect(heading).toBeInTheDocument();
});
