import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component', () => {
  it('renders the title', () => {
    render(<Header />);
    expect(screen.getByText('Gutenberg Project')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<Header />);
    expect(screen.getByText(/social cataloging website/i)).toBeInTheDocument();
  });

  it('has the correct class name', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toHaveClass('header');
  });
}); 