import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '../../components/BookCard';

describe('BookCard Component', () => {
  const mockBook = {
    title: 'Test Book',
    authors: [{ name: 'Test Author' }],
    formats: {
      'image/jpeg': 'test-image.jpg'
    }
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book information', () => {
    render(<BookCard book={mockBook} onBookClick={mockOnClick} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg');
  });

  it('handles missing author', () => {
    const bookWithoutAuthor = { ...mockBook, authors: [] };
    render(<BookCard book={bookWithoutAuthor} onBookClick={mockOnClick} />);
    
    expect(screen.getByText('Unknown Author')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    render(<BookCard book={mockBook} onBookClick={mockOnClick} />);
    
    fireEvent.click(screen.getByText('Test Book'));
    expect(mockOnClick).toHaveBeenCalledWith(mockBook);
  });
}); 