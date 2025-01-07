import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';

describe('SearchBar Component', () => {
  const mockOnChange = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('handles input change', () => {
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );
    
    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('shows clear button when value exists', () => {
    render(
      <SearchBar 
        value="test" 
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );
    
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    render(
      <SearchBar 
        value="test" 
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(mockOnClear).toHaveBeenCalled();
  });
}); 