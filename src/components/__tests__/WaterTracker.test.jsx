import { render, screen } from '@testing-library/react';
import React from 'react';
import WaterTracker from '../WaterTracker';

test('renders Water Intake heading', () => {
  render(<WaterTracker />);
  const heading = screen.getByText(/Water Intake/i);
  expect(heading).toBeInTheDocument();
});
