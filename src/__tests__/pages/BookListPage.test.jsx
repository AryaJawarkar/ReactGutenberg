import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookListPage from '../../pages/BookListPage';
import { supabase } from '../../utils/supabase';

// Mock the entire supabase module
jest.mock('../../utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      filter: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      range: jest.fn().mockResolvedValue({
        data: [
          {
            gutenberg_id: 1,
            title: 'Test Book',
            download_count: 100,
            books_book_authors: [
              {
                books_author: {
                  name: 'Test Author',
                  birth_year: 1900,
                  death_year: 1950
                }
              }
            ],
            books_format: [
              {
                mime_type: 'image/jpeg',
                url: 'test-image.jpg'
              }
            ]
          }
        ],
        count: 1
      })
    }))
  }
}));

// Mock SVG imports
jest.mock('../../assets/images/Back.svg', () => 'back-icon');

describe('BookListPage Component', () => {
  const renderBookListPage = (genre = 'fiction') => {
    render(
      <MemoryRouter initialEntries={[`/books/${genre}`]}>
        <Routes>
          <Route path="/books/:genre" element={<BookListPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderBookListPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders books after loading', async () => {
    renderBookListPage();
    
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
    });
  });

  it('handles search input', async () => {
    renderBookListPage();
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(searchInput.value).toBe('test');
    });
  });

  it('handles pagination', async () => {
    renderBookListPage();
    
    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
    });
  });

  it('handles error state', async () => {
    // Mock error response
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Test error');
    jest.spyOn(supabase, 'from').mockImplementationOnce(() => {
      throw mockError;
    });

    renderBookListPage();
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
}); 