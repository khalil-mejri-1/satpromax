import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch('http://localhost:3000/api/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: `Bienvenue, ${data.user.username} !` });
                localStorage.setItem('user', JSON.stringify(data.user));
                setTimeout(() => navigate('/'), 1500);
            } else {
                setMessage({ type: 'error', text: data.message || "Échec de la connexion Google" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        }
    };

    const handleGoogleError = () => {
        setMessage({ type: 'error', text: "Échec de l'authentification Google" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: `Bienvenue, ${data.user.username} !` });
                // Save user info if needed (e.g. localStorage)
                localStorage.setItem('user', JSON.stringify(data.user));

                setTimeout(() => navigate('/'), 1500);
            } else {
                setMessage({ type: 'error', text: data.message || 'Email ou mot de passe incorrect' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        }
    };

    return (
        <div className="login-page-wrapper">
            <Header />
            <div className="login-container">
                <div className="login-card">
                    <h2>Bon retour !</h2>
                    <p className="login-subtitle">Veuillez entrer vos coordonnées pour vous connecter.</p>

                    {message && (
                        <div style={{
                            padding: '10px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                            color: message.type === 'success' ? '#065f46' : '#b91c1c',
                            border: `1px solid ${message.type === 'success' ? '#34d399' : '#f87171'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Adresse Email</label>
                            <input
                                type="email"
                                placeholder="Entrez votre email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Se souvenir de moi</span>
                            </label>
                            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
                        </div>

                        <button type="submit" className="btn-login">Se connecter</button>

                        <div className="divider">
                            <span>OU</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                text="continue_with"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                    </form>

                    <p className="signup-link">
                        Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
