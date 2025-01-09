import React, { useState } from 'react';
import noCover from '../assets/images/no-cover.svg';

const BookCard = ({ book, onBookClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="book-card" onClick={() => onBookClick(book)}>
      <div className="book-cover">
        <img 
          src={book.formats?.['image/jpeg'] || noCover} 
          alt={book.title}
          className={`book-cover-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">
          {book.authors && book.authors.length > 0 
            ? book.authors[0].name 
            : 'Unknown Author'}
        </p>
      </div>
    </div>
  );
};

export default BookCard; 