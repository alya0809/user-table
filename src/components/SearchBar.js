import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, onClearSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClearSearch();
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Поиск по таблице"
      />
      <button onClick={handleSearch}>Поиск</button>
      <button onClick={handleClear}>Очистить</button>
    </div>
  );
};

export default SearchBar;
