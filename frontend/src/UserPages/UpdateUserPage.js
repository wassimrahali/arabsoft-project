
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from '../Components/Dashboard/Header';
import { Alert } from 'react-bootstrap'; // Import Bootstrap Alert component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UpdateUserPage = ({ match }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    enterpriseName: '',
    adresse: 'Tunisie',
  });

  const [originalUser, setOriginalUser] = useState({});
  const [changesMade, setChangesMade] = useState(false); // Track changes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const userString = localStorage.getItem('user');
  const userObject = JSON.parse(userString);

  // Now you can access the _id property
  const userId = userObject._id;

  useEffect(() => {
    // Fetch user data based on the userId from the URL params
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
        setUser(response.data);
        setOriginalUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
    setChangesMade(true); // User made changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if user made any changes
      if (changesMade) {
        await axios.put(`http://localhost:8000/api/admin/user/${userId}`, user);
        setSuccess(true);
        setError('');
        setChangesMade(false); // Reset changesMade after a successful update
      } else {
        setError('No changes made.'); // Display an error if no changes made
      }
    } catch (error) {
      setSuccess(false);
      setError(error.response.data.error || 'Something went wrong.');
    }
  };

  return (
    <div className='update-user-page'>
      <>
        <Dashboard />
      </>
      
      <form className="formi" onSubmit={handleSubmit}>
        
        <h2 style={{ color: 'black' }}>Update User Information</h2>
        {success && <Alert variant="success">User information updated successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {changesMade && <Alert variant="info">You have unsaved changes!</Alert>}
        <label>

          Name:
          <input type="text" name="name" value={user.name} onChange={handleChange} disabled />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={user.email} onChange={handleChange}  disabled />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={user.password || '**********'} onChange={handleChange} disabled />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} />
        </label>
        <br />
       <label>
          Adresse
          <input type="text" name="adresse" value={user.adresse} onChange={handleChange} />
        </label>
        <br />
        <label>
          Enterprise Name:
          <input type="text" name="enterpriseName" value={user.enterpriseName} onChange={handleChange} />
        </label>
        <br />
        <br />
        <button type="submit">Update Information</button>
      </form>
    </div>
  );
};

export default UpdateUserPage;
