import { useState } from 'react';

function LoginModal({ onClose, onLogin }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('https://flmtask-backend.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                onLogin(data.token);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('https://flmtask-backend.onrender.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Account created successfully! You can now log in.');
                setMode('login');
                setPassword('');
                setConfirmPassword('');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Signup failed');
        }
    };

    const switchToSignup = () => {
        setMode('signup');
        setError('');
        setSuccess('');
    };

    const switchToLogin = () => {
        setMode('login');
        setError('');
        setSuccess('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>×</button>
                <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
                {mode === 'login' ? (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                        <button type="submit" className="login-submit-btn">Login</button>
                        <p className="switch-text">
                            Don't have an account? <button type="button" className="link-btn" onClick={switchToSignup}>Sign up</button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleSignupSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password:</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                        <button type="submit" className="login-submit-btn">Sign Up</button>
                        <p className="switch-text">
                            Already have an account? <button type="button" className="link-btn" onClick={switchToLogin}>Log in</button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default LoginModal;
