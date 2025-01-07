import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import arrowLeft from '../assets/images/Back.svg';

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

  const fetchBooks = useCallback(async (pageNum) => {
    if (booksCache[pageNum]) {
      setBooks(booksCache[pageNum].results);
      setHasMore(booksCache[pageNum].next !== null);
      setTotalCount(booksCache[pageNum].count);
      return;
    }

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
          books_book_bookshelves!left (
            books_bookshelf!left (
              name
            )
          ),
          books_format!left (
            mime_type,
            url
          )
        `, { count: 'exact' });

      if (genre) {
        query = query.filter('books_book_subjects.books_subject.name', 'ilike', `%${genre}%`);
      }
      
      if (search) {
        query = query
          .or(`title.ilike.%${search}%`,`books_book_authors.books_author.name.ilike.%${search}%`)
          ;
      }
      console.log(query);
      console.log(genre, search);
      query = query.range((pageNum - 1) * 32, pageNum * 32 - 1);

      const { data: rawData, count } = await query;

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
          translators: [],
          subjects: book.books_book_subjects?.map(subject => 
            subject.books_subject?.name
          ) || [],
          bookshelves: book.books_book_bookshelves?.map(shelf => 
            shelf.books_bookshelf?.name
          ) || [],
          languages: book.books_book_languages?.map(lang => 
            lang.books_language?.code
          ) || [],
          copyright: false,
          media_type: "Text",
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
      setHasMore(response.next !== null);
      setTotalCount(response.count);

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

  const handleScroll = useCallback((e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      setPage(prev => prev + 1);
    }
  }, []);

  const handleBookClick = async (book) => {
    const formats = ['html', 'pdf', 'txt'];
    
    for (const format of formats) {
      if (book[`${format}_url`]) {
        window.open(book[`${format}_url`], '_blank');
        return;
      }
    }
    
    alert('No viewable version available');
  };

  return (
    <div className="book-list-page">
      <div className="header-container">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src={arrowLeft} alt="arrow-left" />{genre}
        </button>
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
        />
      </div>
      <div className="books-grid" onScroll={handleScroll}>
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
      </div>

      <div className="pagination">
        <button 
          onClick={handlePrevPage}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        
        <span>
          Page {page} of {Math.ceil(totalCount / 32)}
        </span>

        <button 
          onClick={handleNextPage}
          disabled={!hasMore || loading}
        >
          Next
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default BookListPage; 