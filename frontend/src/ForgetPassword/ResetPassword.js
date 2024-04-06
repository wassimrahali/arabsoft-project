import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './ForgetPassword.css'; // Import CSS file
import Navbar from '../Components/Dashboard/Header';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { id, token } = useParams();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8000/api/reset-password/${id}/${token}`, { password });
            if (response.data.Status === 'Success') {
                setSuccess('Password updated successfully!');
                navigate('/reset');
            } else {
                setError('An error occurred while updating the password. Please try again later.');
                setSuccess('');
            }
        } catch (error) {
            setError('An error occurred while updating the password. Please try again later.');
            setSuccess('');
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{marginTop:70}}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card login-form">
                            <div className="card-body">
                                <div class="text-center">
                                    <h3><i class="fa fa-lock fa-3x"></i></h3>
                                </div>
                                <h3 className="card-title text-center">Reset password !</h3>
                                <div className="card-text">
                                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                                    {success && <div className="alert alert-success" role="alert">{success}</div>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="password">New Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="form-control form-control-sm"
                                                    placeholder="Enter your new password"
                                                    name="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <FontAwesomeIcon
                                                    onClick={togglePasswordVisibility}
                                                    icon={showPassword ? faEyeSlash : faEye}
                                                    className='eye-icon'
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword">Confirm Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="form-control form-control-sm"
                                                    placeholder="Confirm your new password"
                                                    name="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                                <FontAwesomeIcon
                                                    onClick={togglePasswordVisibility}
                                                    icon={showPassword ? faEyeSlash : faEye}
                                                    className='eye-icon'
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="forgot-password-button">Update Password</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;
