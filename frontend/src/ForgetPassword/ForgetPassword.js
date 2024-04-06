

import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:8000/api/forgot-password', { email });
            if (response.data.Status === 'Success') {
                setSuccess('Password reset email sent successfully!');
            } else {
                setError('Failed to send reset email. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="formi">
            <div className="forgot-password-box">
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {success && <div className="alert alert-success" role="alert">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">
                            <h4 style={{marginTop:"-20px"}}>Email :</h4>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email ..."
                            autoComplete="off"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="forgot-password-input"
                        />
                    </div>
                    <button type="submit" style={{ marginTop: '30px' }} className="forgot-password-button" disabled={loading}>
                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Send Email'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;




