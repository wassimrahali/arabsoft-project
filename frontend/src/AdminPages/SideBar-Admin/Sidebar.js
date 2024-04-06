// Sidebar.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faUsers, faPlus, faSignOutAlt, } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import { Link, NavLink, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { isAuthenticated, signout } from '../../Backend';


const Sidebar = () => {
  const navigate = useNavigate();
const authenticatedUser = isAuthenticated();
const onSignout = () => {
  signout();
  console.log("Signed out");
  navigate('/home');
};
  return (
    <>
  
    <div className="sidebar">
      
      <h2>Dashboard</h2>
      <ul>
        <div className='rau'>
          <li><FontAwesomeIcon icon={faList} /><Link to="/reservation">Liste des Reservations</Link></li>
          <hr />
          <li><FontAwesomeIcon icon={faUsers} /><Link to="/users">Users</Link></li>
          <hr />
          <li><FontAwesomeIcon icon={faPlus} /><Link to="/addproduct">Ajouter un produit</Link></li>
          
        </div>
        <div className='logout'>
          <li><FontAwesomeIcon  style={{ cursor: 'pointer' }} icon={faSignOutAlt} onClick={onSignout} /><li  onClick={onSignout} style={{ cursor: 'pointer',color:'black' }}>Signup</li></li>
        </div>
      </ul>
    </div>
    </>
  );
};

export default Sidebar;
