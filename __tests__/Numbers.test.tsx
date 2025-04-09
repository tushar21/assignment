import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '../app/numbers/page';


jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/mock-path',
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('Page Component', () => {
  it('renders the Numbers Page title and shows "No data available" when no pairs exist', async () => {
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Numbers Page')).toBeInTheDocument();
    });

    expect(screen.getByText('Adjacent Pairs and Their Sums')).toBeInTheDocument();
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows error when submitting empty input', async () => {
    render(<Page />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Number is required')).toBeInTheDocument();
  });
});
