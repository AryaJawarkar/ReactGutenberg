import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GenreCard from '../../components/GenreCard';

describe('GenreCard Component', () => {
  const mockProps = {
    genre: 'FICTION',
    icon: 'mock-icon'
  };

  it('renders genre name', () => {
    render(
      <BrowserRouter>
        <GenreCard {...mockProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('FICTION')).toBeInTheDocument();
  });

  it('creates correct link', () => {
    render(
      <BrowserRouter>
        <GenreCard {...mockProps} />
      </BrowserRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/books/fiction');
  });

  it('has correct class names', () => {
    render(
      <BrowserRouter>
        <GenreCard {...mockProps} />
      </BrowserRouter>
    );
    expect(screen.getByRole('link')).toHaveClass('genre-card');
  });

  it('renders icon', () => {
    render(
      <BrowserRouter>
        <GenreCard {...mockProps} />
      </BrowserRouter>
    );
    const icon = screen.getByAltText('FICTION');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('genre-icon');
  });
}); 