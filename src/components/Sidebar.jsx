import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Fiction from '../assets/images/Fiction.svg';
import Drama from '../assets/images/Drama.svg';
import Humor from '../assets/images/Humour.svg';
import Politics from '../assets/images/Politics.svg';
import Philosophy from '../assets/images/Philosophy.svg';
import History from '../assets/images/History.svg';
import Adventure from '../assets/images/Adventure.svg';
import Menu from '../assets/images/menu.svg';

const genres = [
  { name: 'FICTION', icon: Fiction },
  { name: 'DRAMA', icon: Drama },
  { name: 'HUMOR', icon: Humor },
  { name: 'POLITICS', icon: Politics },
  { name: 'PHILOSOPHY', icon: Philosophy },
  { name: 'HISTORY', icon: History },
  { name: 'ADVENTURE', icon: Adventure },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { genre: currentGenre } = useParams();

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Categories</h3>
      <div className="sidebar-genres">
        {genres.map((genre) => (
          <div 
            key={genre.name}
            className={`sidebar-genre ${currentGenre.toUpperCase() === genre.name ? 'active' : ''}`}
            onClick={() => navigate(`/books/${genre.name.toLowerCase()}`)}
          >
            <img src={genre.icon} alt={genre.name} className="genre-icon" />
            <span>{genre.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 