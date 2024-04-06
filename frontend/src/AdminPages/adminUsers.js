import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './SideBar-Admin/Sidebar';
import './AdminReservationList/AdminRervationList.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      // Make a DELETE request to delete the user
      const response = await axios.delete(`http://localhost:8000/api/admin/user/${userId}`);

      if (response.data.message === 'User deleted successfully') {
        // If deletion is successful, update the users state
        setUsers(users.filter(user => user._id !== userId));

        // Show success alert
        setAlert({
          type: 'success',
          message: 'User deleted successfully!',
        });

        // Hide success alert after 3 seconds
        setTimeout(() => setAlert(null), 3000);
      } else {
        console.error('Error deleting user:', response.data.error);

        // Show error alert
        setAlert({
          type: 'danger',
          message: 'Error deleting user. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);

      // Show error alert
      setAlert({
        type: 'danger',
        message: 'Error deleting user. Please try again.',
      });
    }
  };

  return (
    <>
      <div className="admin-reservation-list">
        <Sidebar />

        <div className="content-b" style={{ color: 'black' }}>
          <div className="card" style={{ width: '95%', padding: '15px' }}>
            <div className="card-header">
            <h5 className="card-title">
    <i className="fas fa-users" />   Gestion Des utilisateurs
</h5>

            </div>

            {/* Bootstrap Alert */}
            {alert && (
              <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                {alert.message}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setAlert(null)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Entreprise Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user => user.role !== 'admin') // Filter out users with admin role
                  .map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <th>{user.phoneNumber}</th>
                      <th>{user.enterpriseName}</th>
                      <td>
                        <button onClick={() => handleDelete(user._id)} style={{ backgroundColor:"#3E97FF", padding: "15px",}}>
                          <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
