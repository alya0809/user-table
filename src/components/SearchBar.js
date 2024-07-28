import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, onClearSearch }) => {
  // Хук состояния для хранения значения поискового запроса
  const [query, setQuery] = useState('');

  // Обработчик изменения значения в поле ввода
  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  // Обработчик нажатия на кнопку поиска
  const handleSearch = () => {
    onSearch(query);
  };

  // Обработчик нажатия на кнопку очистки
  const handleClear = () => {
    setQuery(''); // Сбросить значение поискового запроса
    onClearSearch(); // Вызвать функцию очистки поиска
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={query} // Значение поля ввода привязано к состоянию query
        onChange={handleChange} // При изменении значения вызывается handleChange
        placeholder="Поиск по таблице" // Подсказка в поле ввода
      />
      <button onClick={handleSearch}>Поиск</button>
      <button onClick={handleClear}>Очистить</button>
    </div>
  );
};

export default SearchBar;
