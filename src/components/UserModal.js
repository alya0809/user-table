import React from 'react';
import '../styles/UserModal.css';

const UserModal = ({ user, onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <h2>{user.firstName} {user.lastName}</h2>
        <p>Возраст: {user.age}</p>
        <p>Адрес: {user.address.city}, {user.address.address}</p>
        <p>Рост: {user.height} см</p>
        <p>Вес: {user.weight} кг</p>
        <p>Номер телефона: {user.phone}</p>
        <p>Email: {user.email}</p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </>
  );
};

export default UserModal;
