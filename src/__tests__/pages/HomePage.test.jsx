import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';

// Mock the Header component
jest.mock('../../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Gutenberg Project</div>;
  };
});

// Mock the GenreCard component
jest.mock('../../components/GenreCard', () => {
  return function MockGenreCard({ genre }) {
    return <div data-testid={`genre-card-${genre.toLowerCase()}`}>{genre}</div>;
  };
});

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header component', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders all genre cards', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const genres = [
      'FICTION',
      'DRAMA',
      'HUMOR',
      'POLITICS',
      'PHILOSOPHY',
      'HISTORY',
      'ADVENTURE'
    ];

    genres.forEach(genre => {
      expect(screen.getByText(genre)).toBeInTheDocument();
      expect(screen.getByTestId(`genre-card-${genre.toLowerCase()}`)).toBeInTheDocument();
    });
  });

  it('renders the correct number of genre cards', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const genreCards = screen.getAllByTestId(/genre-card-/);
    expect(genreCards).toHaveLength(7);
  });

  it('renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(container.firstChild).toHaveClass('home-page');
  });
}); 