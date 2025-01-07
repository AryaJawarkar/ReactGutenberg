import React from 'react';
import { Link } from 'react-router-dom';
import Arrow from '../assets/images/Next.svg';
const GenreCard = ({ genre, icon }) => {
  return (
    <Link to={`/books/${genre.toLowerCase()}`} className="genre-card">
      <img src={icon} alt={genre} className="genre-icon" />
      <span className="genre-name">{genre}</span>
      <img src={Arrow} alt="arrow" className="arrow"/>
    </Link>
  );
};

export default GenreCard; 