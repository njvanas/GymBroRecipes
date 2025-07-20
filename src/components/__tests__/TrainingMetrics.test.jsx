import { render, screen } from '@testing-library/react';
import TrainingMetrics from '../TrainingMetrics';
import React from 'react';

test('renders Training Metrics heading', () => {
  render(<TrainingMetrics exercises={[{weight:10,reps:5,sets:1,rpe:8}]} />);
  const heading = screen.getByText(/Training Metrics/i);
  expect(heading).toBeInTheDocument();
});
