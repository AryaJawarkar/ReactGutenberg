# Gutenberg Library

A modern web application that provides access to the Project Gutenberg digital library. Built with React, Vite, and Supabase.

## Features

- Browse books by genre categories
- Search functionality with debouncing
- Responsive grid layout
- Pagination support
- Book details with download options
- Clean and modern UI
- Comprehensive test coverage

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Router**: React Router v6
- **Database**: Supabase
- **Testing**: Jest + React Testing Library
- **Styling**: CSS Modules
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- A Supabase account and project

## Environment Variables

Create a `.env` file in the root directory:

env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Project Structure

gutenberg-library/
├── src/
│ ├── tests/ # Test files
│ ├── assets/ # Static assets (images, icons)
│ ├── components/ # Reusable components
│ ├── pages/ # Page components
│ ├── styles/ # Global styles
│ ├── utils/ # Utility functions
│ ├── App.jsx # Root component
│ └── main.jsx # Entry point
├── public/ # Public assets
├── .github/ # GitHub Actions workflows
├── .env # Environment variables
└── package.json # Project dependencies

## Components

### Pages
- `HomePage`: Landing page with genre categories
- `BookListPage`: Displays books with search and pagination

### Core Components
- `Header`: Main application header
- `SearchBar`: Search input with debouncing
- `BookCard`: Individual book display
- `GenreCard`: Genre category display
- `Pagination`: Page navigation controls

## Testing

The application includes comprehensive tests for all components:
```bash
npm test                # Run all tests
npm run test:coverage   # Generate coverage report
```

Test files are located in `src/__tests__/` and follow the pattern `*.test.jsx`.

## Deployment

The application is configured for deployment to GitHub Pages using GitHub Actions. The workflow is triggered on push to the master branch.

To deploy:
1. Push changes to master
2. GitHub Actions will automatically:
   - Run tests
   - Build the application
   - Deploy to GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Acknowledgments

- Project Gutenberg for providing the books database
- Supabase for the backend infrastructure
- React and Vite teams for the excellent development tools

## Technical Implementation

### Supabase Integration

The application uses Supabase as its backend service with the following structure:

#### Database Tables
- `books_book`: Main table containing book information
  - `gutenberg_id`: Unique identifier from Project Gutenberg
  - `title`: Book title
  - `download_count`: Number of downloads
  - `created_at`: Timestamp of record creation

- `books_author`: Authors information
  - `name`: Author's full name
  - `birth_year`: Author's birth year
  - `death_year`: Author's death year

- `books_book_authors`: Junction table for books and authors
  - `book_id`: Reference to books_book
  - `author_id`: Reference to books_author

- `books_format`: Book format information
  - `book_id`: Reference to books_book
  - `mime_type`: Format type (e.g., 'text/plain', 'application/pdf')
  - `url`: Download URL

#### Supabase Queries
```javascript
// Example book fetch with relationships
const fetchBooks = async (genre, searchQuery, page) => {
  const query = supabase
    .from('books_book')
    .select(`
      gutenberg_id,
      title,
      download_count,
      books_book_authors!left (
        books_author!left (
          name,
          birth_year,
          death_year
        )
      ),
      books_format!left (
        mime_type,
        url
      )
    `)
    .order('download_count', { ascending: false })
    .range(startIndex, endIndex);

  // Apply genre filter if provided
  if (genre) {
    query.filter('genre', 'eq', genre.toLowerCase());
  }

  // Apply search if provided
  if (searchQuery) {
    query.or(`title.ilike.%${searchQuery}%,books_book_authors.books_author.name.ilike.%${searchQuery}%`);
  }

  return await query;
};
```

### Key Features Implementation

#### Search with Debouncing
```javascript
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

#### Pagination
- Implemented using range-based pagination
- Default page size: 32 items
- Maintains total count for page calculation
- Supports previous/next navigation

#### Genre Categories
- Predefined genres with custom icons
- Dynamic routing using React Router
- Genre-specific book filtering

#### Book Cards
- Displays book title, author, and cover
- Download options for different formats
- Click handling for detailed view

### State Management
- React's built-in useState and useEffect hooks
- Custom hooks for specific functionality
- Context API for global state (when needed)

### Testing Strategy

#### Unit Tests
- Component rendering tests
- User interaction tests
- API integration tests
- Custom hook tests

#### Mock Implementation
```javascript
// Supabase mock for testing
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      filter: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      range: jest.fn().mockResolvedValue({
        data: [/* mock data */],
        count: 1
      })
    }))
  })
}));
```

### Styling
- CSS Modules for component-specific styling
- Responsive design using CSS Grid and Flexbox
- Custom SVG icons for genres
- Mobile-first approach

### Performance Optimizations
- Debounced search queries
- Pagination for large datasets
- Lazy loading of images
- Memoized components when beneficial

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Loading states for async operations
- Fallback UI components

### Development Tools
- ESLint for code quality
- Prettier for code formatting
- Jest and React Testing Library for testing
- GitHub Actions for CI/CD

## API Documentation

The API documentation is available through Swagger UI at `/api-docs`. To view the documentation:

1. Start the development server:
```bash
npm run dev
```

2. Visit http://localhost:5173/api-docs in your browser

The documentation includes:
- Available endpoints
- Request/response schemas
- Authentication requirements
- Example requests
- Response formats

You can also test the API endpoints directly through the Swagger UI interface.
