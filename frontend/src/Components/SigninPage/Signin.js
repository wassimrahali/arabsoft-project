import React, { useState } from 'react';
import { signin, authenticate, isAuthenticated } from '../../Backend';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import Navbar from '../Dashboard/Header';
import { Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ForgotPassword from '../../ForgetPassword/ForgetPassword'; // Import the ForgotPassword component
import '../../ForgetPassword/ForgetPassword'; // Import the ForgotPassword component

export function Signin() {
  const navigate = useNavigate();
  const authenticatedUser = isAuthenticated();
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    success: false,
    showPassword: false,
    showForgotModal: false, // State to control modal visibility
  });

  const { email, password, error, loading, success, showPassword, showForgotModal } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setValues({ ...values, showPassword: !showPassword });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values, success: false, loading: true });

    // Simulating a 5-second loading delay
    setTimeout(() => {
      signin({ email, password })
          .then((data) => {
            if (data.error) {
              setValues({ ...values, error: data.error, loading: false, success: false });
            } else {
              authenticate(data, () => {
                setValues({ ...values, success: true });
                // Redirect based on user role
                if (isAuthenticated().user.role === 'admin') {
                  navigate('/users'); // Redirect admin to '/users'
                } else {
                  navigate('/'); // Redirect regular user to home
                }
              });
            }
          })
          .catch();
    }, 3000);
  };

    const errorMessage = () => {
        return (
            <Alert variant="danger" show={error != '' && !loading}>
                {error}
            </Alert>
        );
    };

  const loadingMessage = () => {
    return (
        loading && (
            <Alert variant="warning">
              <div className='loading-spinner'></div>
              <p>Loading...</p>
            </Alert>
        )
    );
  };

  const successMessage = () => {
    return (
        success && (
            <Alert variant="success">
              Password reset successful. You can now sign in with your new password.
            </Alert>
        )
    );
  };

  return (
      <>
        <Navbar />
        <h2 className='text-signin' style={{ color: 'black' }}>
          Découvrez nos logiciels Entreprise Management pour chaque secteur d’activité
        </h2>
        {success ? (
            <Navigate to='/' />
        ) : (
            <div className='form-container'>
              <div className='form-box' style={{ marginTop: '-310px' }}>
                <h2>Sign In</h2>
                {loadingMessage()}
                {errorMessage()}
                {successMessage()} {/* Add this line to display success message */}
                <div className='form-group'>
                  <label htmlFor='email'>Email</label>
                  <input type='text' id='email' name='email' value={email} onChange={handleChange('email')} required />
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>Password</label>
                  <div className='password-input-container'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        name='password'
                        value={password}
                        onChange={handleChange('password')}
                        required
                    />
                    <FontAwesomeIcon
                        onClick={togglePasswordVisibility}
                        icon={showPassword ? faEye : faEyeSlash}
                        className='eye-icon'
                    />
                  </div>
                </div>
                <div className='form-group-button'>
                  <button onClick={onSubmit}>Log in</button>
                </div>
                <br />
                <div className='login-message'>
                  <center>
                    <p className='login_redirect mt-2 '>
                      Don't have an account ? <b style={{ color: 'red' }}><Link to='/signup'>Signup Here</Link></b>
                    </p>
                    <p className='login_redirect mt-2'>
                      <hr />
                      Forgot your password ? <b style={{ color: '#993062' }} className="pointer" onClick={() => setValues({ ...values, showForgotModal: true })}>Reset Password</b>
                    </p>
                  </center>
                </div>
              </div>
            </div>
        )}
        <Modal show={showForgotModal} onHide={() => setValues({ ...values, showForgotModal: false })}>
          <Modal.Header closeButton className="close-button" style={{ color: 'black' }}>
            <Modal.Title>Forgot Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ForgotPassword />
          </Modal.Body>
        </Modal>
      </>
  );
}

export default Signin;
