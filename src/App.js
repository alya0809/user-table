import React, { useState, useEffect } from 'react';
import UserTable from './components/UserTable';
import SearchBar from './components/SearchBar';
import UserModal from './components/UserModal';
import './styles/App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setFilteredUsers(data.users);
      });
  }, []);

  const handleSearch = (query) => {
    const keys = getKeyForSearch(query);

    const searchPromises = keys.map(key => 
      fetch(`https://dummyjson.com/users/filter?key=${key}&value=${query}`)
        .then(res => res.json())
        .then(data => data.users || [])
    );

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

  const handleClearSearch = () => {
    setFilteredUsers(users);
  };

  const getKeyForSearch = (query) => {
    if (!isNaN(query)) {
      return ['age']; // If the query is a number, search by age
    } else if (query.toLowerCase() === 'male' || query.toLowerCase() === 'female') {
      return ['gender']; // If the query is male or female, search by gender
    } else if (/^\d+$/.test(query)) {
      return ['phone']; // If the query is digits only, search by phone
    } else if (/^[a-zA-Z\s]+$/.test(query)) {
      return ['firstName', 'lastName', 'address.city']; // If the query contains only letters and spaces, search by firstName, lastName, and city
    } else if (/^[a-zA-Z0-9\s,]+$/.test(query)) {
      return ['address.address']; // If the query contains letters, digits, spaces, or commas, search by address
    } else {
      return ['firstName']; // Default to search by firstName for simplicity
    }
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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
