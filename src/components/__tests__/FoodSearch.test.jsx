import { render, screen } from '@testing-library/react';
import FoodSearch from '../FoodSearch';
import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders Food Search heading', () => {
  render(<FoodSearch onSelect={() => {}} />);
  const heading = screen.getByText(/Food Search/i);
  expect(heading).toBeInTheDocument();
});

test('shows no results message when search returns empty', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: () => Promise.resolve({ products: [] }),
  });
  render(<FoodSearch onSelect={() => {}} />);
  fireEvent.change(screen.getByLabelText(/Search food/i), {
    target: { value: 'foo' },
  });
  fireEvent.click(screen.getByLabelText(/Search/));
  await waitFor(() => screen.getByText(/No results found/i));
});
