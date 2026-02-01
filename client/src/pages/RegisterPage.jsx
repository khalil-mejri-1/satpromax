import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { API_BASE_URL } from '../config';

import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: `Bienvenue, ${data.user.username} ! Compte créé avec succès.` });
                localStorage.setItem('user', JSON.stringify(data.user));
                setTimeout(() => navigate('/'), 1500);
            } else {
                setMessage({ type: 'error', text: data.message || "Échec de l'inscription Google" });
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

        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Inscription réussie ! Redirection...' });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMessage({ type: 'error', text: data.message || 'Erreur lors de l\'inscription' });
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
                    <h2>Créer un compte</h2>
                    <p className="login-subtitle">Rejoignez Satpromax dès aujourd'hui.</p>

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
                            <label>Nom d'utilisateur</label>
                            <input
                                type="text"
                                placeholder="Votre nom"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Adresse Email</label>
                            <input
                                type="email"
                                placeholder="exemple@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmer Mot de passe</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-login">S'inscrire</button>

                        <div className="divider">
                            <span>OU</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                text="signup_with"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                    </form>

                    <p className="signup-link">
                        Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
