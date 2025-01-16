import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import arrowLeft from '../assets/images/Back.svg';
import { handleZipFile } from '../utils/zipHandler';
import Sidebar from '../components/Sidebar';
import Menu from '../assets/images/menu.svg';
const BookListPage = () => {
  const { genre } = useParams();
  const navigate = useNavigate();
  const [booksCache, setBooksCache] = useState({});
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [zipContent, setZipContent] = useState(null);
  const [loadingZip, setLoadingZip] = useState(false);
  const [zipError, setZipError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchBooks = useCallback(async (pageNum) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
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
          books_book_languages!left (
            books_language!left (
              code
            )
          ),
          books_book_subjects!inner (
            books_subject!inner (
              name
            )
          ),
          books_format!left (
            mime_type,
            url
          )
        `, { count: 'exact' })
        .order('download_count', { ascending: false });

      if (genre) {
        query = query.filter('books_book_subjects.books_subject.name', 'ilike', `%${genre}%`);
      }
      
      if (search) {
        query = query.or(
          `title.ilike.%${search}%`,
          `books_book_authors.books_author.name.ilike.%${search}%`
        );
      }

      query = query.range((pageNum - 1) * 32, pageNum * 32 - 1);

      const { data: rawData, count, error } = await query;
      console.log(rawData);

      if (error) throw error;

      if (!rawData) {
        setBooks([]);
        setHasMore(false);
        setTotalCount(0);
        return;
      }

      const response = {
        count: count || 0,
        results: rawData.map(book => ({
          id: book.gutenberg_id,
          title: book.title,
          authors: book.books_book_authors?.map(author => ({
            name: author.books_author?.name || '',
            birth_year: author.books_author?.birth_year,
            death_year: author.books_author?.death_year
          })) || [],
          formats: book.books_format?.reduce((acc, format) => {
            if (format?.mime_type && format?.url) {
              acc[format.mime_type] = format.url;
            }
            return acc;
          }, {}) || {},
          download_count: book.download_count || 0
        }))
      };

      if (!search) {
        setBooksCache(prev => ({
          ...prev,
          [pageNum]: response
        }));
      }

      setBooks(response.results);
      setHasMore(count > pageNum * 32);
      setTotalCount(count);

    } catch (error) {
      console.error('Error fetching books:', error);
      setError(error.message);
      setBooks([]);
      setHasMore(false);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [genre, search, loading]);

  useEffect(() => {
    setBooksCache({});
    setPage(1);
    setBooks([]);
    fetchBooks(1);
  }, [genre, search]);

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage = Math.max(1, page - 1);
    setPage(prevPage);
    fetchBooks(prevPage);
  };

  useEffect(() => {
    if (Object.keys(booksCache).length > 10) {
      const recentPages = Object.keys(booksCache)
        .sort((a, b) => b - a)
        .slice(0, 5);
      
      const newCache = recentPages.reduce((acc, pageNum) => {
        acc[pageNum] = booksCache[pageNum];
        return acc;
      }, {});
      
      setBooksCache(newCache);
    }
  }, [booksCache]);

  // const handleScroll = useCallback((e) => {
  //   const { scrollTop, clientHeight, scrollHeight } = e.target;
  //   if (scrollHeight - scrollTop <= clientHeight * 1.5) {
  //     setPage(prev => prev + 1);
  //   }
  // }, []);

  const handleBookClick = async (book) => {
    // Check for viewable formats in order of preference
    const preferredFormats = [
      'text/html',
      'application/pdf',
      'text/plain; charset=utf-8',
      'text/plain',
      'application/zip'
    ];
    
    const formats = book.formats || {};
    
    for (const format of preferredFormats) {
      if (formats[format]) {
        if (format === 'application/zip') {
          try {
            setLoadingZip(true);
            setZipError(null);
            const contents = await handleZipFile(formats[format]);
            setZipContent(contents);
          } catch (err) {
            setZipError('Error loading ZIP file');
            console.error(err);
          } finally {
            setLoadingZip(false);
          }
          return;
        }
        window.open(formats[format], '_blank');
        return;
      }
    }
    
    // If no viewable format is found
    alert('No viewable version available');
  };

  // Close sidebar when clicking outside on mobile
  const handleClickOutside = (e) => {
    if (window.innerWidth <= 768 && 
        !e.target.closest('.sidebar') && 
        !e.target.closest('.sidebar-toggle')) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`book-list-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Toggle button - visible on both mobile and desktop */}
      <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {/* {isSidebarOpen ? '←' : '→'} */}
        <img src={Menu} alt="menu" className="menu-icon" />
      </button>
      
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>

      <div className="book-list-page">
        <div className="header-container">
          <button className="back-button" onClick={() => navigate('/')}>
            <img src={arrowLeft} alt="arrow-left" className='arrow-left' />{genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
          />
        </div>
        {loading && <div className="loading">Loading...</div>}
        {!loading && <div className="books-grid">
          {error && <div className="error">{error}</div>}
          {books.length === 0 && !loading && !error && (
            <div className="no-books">No books found</div>
          )}
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onBookClick={handleBookClick}
            />
          ))}
        </div>}

        {zipContent && (
          <div className="zip-viewer">
            <div className="zip-viewer-content">
              <button 
                className="close-button"
                onClick={() => setZipContent(null)}
              >
                Close
              </button>
              <h3>Book Contents</h3>
              {zipContent.map((file, index) => (
                <details key={index}>
                  <summary>{file.filename}</summary>
                  <pre className="file-content">
                    {file.content.slice(0, 1000)}
                    {file.content.length > 1000 && '...'}
                  </pre>
                </details>
              ))}
            </div>
          </div>
        )}

        {loadingZip && (
          <div className="loading-overlay">
            Loading book contents...
          </div>
        )}

         <div className="pagination">
          <button 
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
          >
            Previous
          </button>
          
          <span className="page-number">
            Page {page} of {Math.ceil(totalCount / 32)}
          </span>

          <button 
            onClick={handleNextPage}
            disabled={!hasMore || loading}
          >
            Next
          </button>
        </div>

        {/* {loading && <div className="loading">Loading...</div>} */}
      </div>
    </div>
  );
};

export default BookListPage; 