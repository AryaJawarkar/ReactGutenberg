import React from 'react';

const BookCard = ({ book, onBookClick }) => {
  return (
    <div className="book-card" onClick={() => onBookClick(book)}>
      <div className="book-cover">
        <img src={book.formats?.['image/jpeg']} alt={book.title} />
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