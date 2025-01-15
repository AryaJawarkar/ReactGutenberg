import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookListPage from './pages/BookListPage';
import ApiDocs from './components/ApiDocs';
import './styles/index.css';

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:genre" element={<BookListPage />} />
        <Route path="/api-docs" element={<ApiDocs />} />
      </Routes>
    </main>
  );
}

export default App;
