import React from 'react';
import Header from '../components/Header';
import GenreCard from '../components/GenreCard';
import Fiction from '../assets/images/Fiction.svg';
import Drama from '../assets/images/Drama.svg';
import Humor from '../assets/images/Humour.svg';
import Politics from '../assets/images/Politics.svg';
import Philosophy from '../assets/images/Philosophy.svg';
import History from '../assets/images/History.svg';
import Adventure from '../assets/images/Adventure.svg';

const genres = [
  { name: 'FICTION', icon: Fiction },
  { name: 'DRAMA', icon: Drama },
  { name: 'HUMOR', icon: Humor },
  { name: 'POLITICS', icon: Politics },
  { name: 'PHILOSOPHY', icon: Philosophy },
  { name: 'HISTORY', icon: History },
  { name: 'ADVENTURE', icon: Adventure },
];

const HomePage = () => {
  console.log('HomePage rendered');
  return (
    <div className="home-page">
      <Header />
      <div className="genres-container">
        {genres.map((genre) => (
          <GenreCard 
            key={genre.name} 
            genre={genre.name} 
            icon={genre.icon} 
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage; 