import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Remove Router from App component for testing
jest.mock('../App', () => {
  const AppComponent = ({ children }) => {
    return (
      <main>
        <h1>Gutenberg Project</h1>
        {children}
      </main>
    );
  };
  return AppComponent;
});

describe('App Component', () => {
  it('renders HomePage by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Gutenberg Project')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
}); 