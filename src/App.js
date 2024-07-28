import React, { useState, useEffect } from 'react';
import UserTable from './components/UserTable';
import SearchBar from './components/SearchBar';
import UserModal from './components/UserModal';
import './styles/App.css';

const App = () => {
  // Хук состояния для хранения всех пользователей
  const [users, setUsers] = useState([]);
  // Хук состояния для хранения отфильтрованных пользователей
  const [filteredUsers, setFilteredUsers] = useState([]);
  // Хук состояния для хранения выбранного пользователя
  const [selectedUser, setSelectedUser] = useState(null);
  // Хук состояния для сортировки
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // Эффект для загрузки данных о пользователях при монтировании компонента
  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setFilteredUsers(data.users);
      });
  }, []);

  // Обработчик поиска пользователей
  const handleSearch = (query) => {
    const keys = getKeyForSearch(query);

    const searchPromises = keys.map(key =>
      fetch(`https://dummyjson.com/users/filter?key=${key}&value=${query}`)
        .then(res => res.json())
        .then(data => data.users || [])
    );

    // Ожидание выполнения всех запросов и обновление отфильтрованных пользователей
    Promise.all(searchPromises)
      .then(results => {
        const users = results.flat();
        const uniqueUsers = Array.from(new Set(users.map(u => u.id))).map(id => users.find(u => u.id === id));
        setFilteredUsers(uniqueUsers);
      })
      .catch(error => {
        console.error("Error during search:", error);
      });
  };

  // Обработчик очистки результатов поиска
  const handleClearSearch = () => {
    setFilteredUsers(users);
  };

  // Определение ключа для поиска
  const getKeyForSearch = (query) => {
    if (!isNaN(query)) {
      return ['age']; // Если запрос - число, искать по возрасту
    } else if (query.toLowerCase() === 'male' || query.toLowerCase() === 'female') {
      return ['gender']; // Если запрос - male или female, искать по полу
    } else if (/^[\d\s\-+]+$/.test(query)) {
      return ['phone']; // Если запрос состоит из цифр и пробела, - и +, искать по телефону
    } else if (/^[a-zA-Z\s]+$/.test(query)) {
      return ['firstName', 'lastName', 'address.city']; // Если запрос состоит только из букв и пробелов, искать по имени, фамилии и городу
    } else if (/^[a-zA-Z0-9\s,]+$/.test(query)) {
      return ['address.address']; // Если запрос состоит из букв, цифр, пробелов или запятых, искать по адресу
    } else {
      return ['firstName']; // По умолчанию искать по имени
    }
  };

  // Обработчик клика на строку таблицы
  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  // Обработчик сортировки по ключу
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        // Если текущее направление сортировки - 'descending', сбрасываем сортировку
        key = null;
      }
    }
    setSortConfig({ key, direction });
  };
  

  // Вычисление отсортированных пользователей
  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = sortConfig.key === 'fullName' ? `${a.firstName} ${a.lastName}` : sortConfig.key === 'address' ? `${a.address.city}, ${a.address.address}` : a[sortConfig.key];
        const bValue = sortConfig.key === 'fullName' ? `${b.firstName} ${b.lastName}` : sortConfig.key === 'address' ? `${b.address.city}, ${b.address.address}` : b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} onClearSearch={handleClearSearch} />
      {filteredUsers.length === 0 ? (
        <p>Ничего не найдено</p>
      ) : (
        <UserTable users={sortedUsers} onRowClick={handleRowClick} onSort={handleSort} sortConfig={sortConfig} />
      )}
      {selectedUser && <UserModal user={selectedUser} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
