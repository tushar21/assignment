import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Page from '../app/grades/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('Grades Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the grade form and all buttons', async () => {
    await act(async () => {
      render(<Page />);
    });

    expect(screen.getByRole('button', { name: /show all data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /class averages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /passing average/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /high performing classes/i })).toBeInTheDocument();
  });

  it('shows "No data found" when no grades are returned', async () => {
    await act(async () => {
      render(<Page />);
    });

    await waitFor(() => {
      expect(screen.getByText('No data found')).toBeInTheDocument();
    });
  });

  it('shows error when submitting with empty fields', async () => {
    await act(async () => {
      render(<Page />);
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Please select a valid class.')).toBeInTheDocument();
    });
  });

  it('allows typing a valid grade value', async () => {
    await act(async () => {
      render(<Page />);
    });

    const gradeInput = screen.getByLabelText('Grade') as HTMLInputElement;
    fireEvent.change(gradeInput, { target: { value: '85' } });

    expect(gradeInput.value).toBe('85');
  });
});
