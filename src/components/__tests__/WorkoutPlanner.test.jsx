import { render, screen } from '@testing-library/react';
import WorkoutPlanner from '../WorkoutPlanner';
import React from 'react';

test('renders Workout Planner heading', () => {
  render(<WorkoutPlanner />);
  const heading = screen.getByText(/Workout Planner/i);
  expect(heading).toBeInTheDocument();
});
