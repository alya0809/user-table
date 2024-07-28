import React from 'react';
import '../styles/UserTable.css';

const UserTable = ({ users, onRowClick, onSort, sortConfig }) => {
  // Функция для получения индикатора сортировки (стрелка вверх, вниз или двусторонняя)
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '↕';
  };

  return (
    <div className="table-container">
      {/* Если нет пользователей, отображается сообщение "Ничего не найдено" */}
      {!users.length ? (
        <p className="no-results">Ничего не найдено</p>) : (
        <table className='table'>
          <thead>
            <tr>
              <th onClick={() => onSort('fullName')}>ФИО {getSortIndicator('fullName')}</th>
              <th onClick={() => onSort('age')}>Возраст {getSortIndicator('age')}</th>
              <th onClick={() => onSort('gender')}>Пол {getSortIndicator('gender')}</th>
              <th>Номер телефона</th>
              <th onClick={() => onSort('address')}>Адрес {getSortIndicator('address')}</th>
            </tr>
          </thead>
          <tbody>
            {/* Перебираем пользователей и создаем строки таблицы */}
            {users.map(user => (
              <tr key={user.id} onClick={() => onRowClick(user)}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.phone}</td>
                <td>{user.address.city}, {user.address.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
