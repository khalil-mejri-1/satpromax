import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { API_BASE_URL } from '../config';

import { GoogleLogin } from '@react-oauth/google';
import TwoFactorSetup from '../components/TwoFactorSetup';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    // 2FA Prompt State
    const [show2FAPrompt, setShow2FAPrompt] = useState(false);
    const [setupUser, setSetupUser] = useState(null);
    const [isSetupOpen, setIsSetupOpen] = useState(false);

    // Forgot Password State
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: Code, 3: New Pass
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotCode, setForgotCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [forgotMessage, setForgotMessage] = useState(null);
    const [isForgotLoading, setIsForgotLoading] = useState(false);

    // 2FA State
    const [require2FA, setRequire2FA] = useState(false);
    const [userIdFor2FA, setUserIdFor2FA] = useState(null);
    const [token2FA, setToken2FA] = useState('');
    const [loading2FA, setLoading2FA] = useState(false);
    const widgetRef = React.useRef(null);

    React.useEffect(() => {
        const renderTurnstile = () => {
            if (window.turnstile && widgetRef.current) {
                window.turnstile.render(widgetRef.current, {
                    sitekey: '0x4AAAAAACY_TRkoirfO1kT5',
                    callback: (token) => setCaptchaToken(token),
                    'error-callback': () => setCaptchaToken(null),
                    'expired-callback': () => setCaptchaToken(null),
                });
            }
        };

        if (window.turnstile) {
            renderTurnstile();
        } else {
            const checkTurnstile = setInterval(() => {
                if (window.turnstile) {
                    renderTurnstile();
                    clearInterval(checkTurnstile);
                }
            }, 100);
            return () => clearInterval(checkTurnstile);
        }
    }, []);

    const handleForgotClick = (e) => {
        e.preventDefault();
        setIsForgotModalOpen(true);
        setForgotStep(1);
        setForgotMessage(null);
        setForgotEmail('');
        setForgotCode('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    const closeForgotModal = () => {
        setIsForgotModalOpen(false);
        setForgotMessage(null);
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsForgotLoading(true);
        setForgotMessage(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await res.json();
            if (data.success) {
                setForgotStep(2);
                setForgotMessage({ type: 'success', text: data.message });
            } else {
                setForgotMessage({ type: 'error', text: data.message });
            }
        } catch (err) {
            setForgotMessage({ type: 'error', text: "Erreur serveur" });
        }
        setIsForgotLoading(false);
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setIsForgotLoading(true);
        setForgotMessage(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, code: forgotCode })
            });
            const data = await res.json();
            if (data.success) {
                setForgotStep(3);
                setForgotMessage(null);
            } else {
                setForgotMessage({ type: 'error', text: data.message });
            }
        } catch (err) {
            setForgotMessage({ type: 'error', text: "Erreur serveur" });
        }
        setIsForgotLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setForgotMessage({ type: 'error', text: "Le mot de passe doit contenir au moins 6 caractères" });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setForgotMessage({ type: 'error', text: "Les mots de passe ne correspondent pas" });
            return;
        }

        setIsForgotLoading(true);
        setForgotMessage(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, code: forgotCode, newPassword })
            });
            const data = await res.json();
            if (data.success) {
                closeForgotModal();
                setMessage({ type: 'success', text: "Mot de passe réinitialisé avec succès ! Connectez-vous." });
            } else {
                setForgotMessage({ type: 'error', text: data.message });
            }
        } catch (err) {
            setForgotMessage({ type: 'error', text: "Erreur serveur" });
        }
        setIsForgotLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });
            const data = await response.json();


            if (data.success) {
                if (data.require2FA) {
                    setRequire2FA(true);
                    setUserIdFor2FA(data.userId); // Ensure backend sends userId
                    setMessage({ type: 'success', text: 'Validation 2FA requise' });
                    return;
                }

                if (!data.user.twoFactorEnabled) {
                    setSetupUser(data.user);
                    setShow2FAPrompt(true);
                    // Store temporarily
                    localStorage.setItem('user', JSON.stringify(data.user));
                    return;
                }

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
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, captchaToken })
            });
            const data = await response.json();


            if (data.success) {
                if (data.require2FA) {
                    setRequire2FA(true);
                    setUserIdFor2FA(data.userId);
                    setMessage({ type: 'success', text: 'Validation 2FA requise' });
                    return;
                }

                if (!data.user.twoFactorEnabled) {
                    setSetupUser(data.user);
                    setShow2FAPrompt(true);
                    // Store temporarily
                    localStorage.setItem('user', JSON.stringify(data.user));
                    return;
                }

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

    const handle2FASubmit = async (e) => {
        e.preventDefault();
        setLoading2FA(true);
        setMessage(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/2fa/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userIdFor2FA, token: token2FA })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: `Bienvenue, ${data.user.username} !` });
                localStorage.setItem('user', JSON.stringify(data.user));
                setRequire2FA(false);
                setTimeout(() => navigate('/'), 1500);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Erreur serveur" });
        }
        setLoading2FA(false);
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
                            <button
                                type="button"
                                onClick={handleForgotClick}
                                className="forgot-password"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>

                        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
                            <div ref={widgetRef}></div>
                        </div>

                        <button type="submit" className="btn-login" disabled={!captchaToken}>Se connecter</button>

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

            {/* Forgot Password Modal */}
            {isForgotModalOpen && (
                <div className="auth-modal-overlay" onClick={closeForgotModal}>
                    <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="auth-modal-close" onClick={closeForgotModal}>×</button>

                        <div className="auth-modal-header">
                            <h3>Réinitialiser le mot de passe</h3>
                        </div>

                        {forgotMessage && (
                            <div className={`auth-message ${forgotMessage.type}`}>
                                {forgotMessage.text}
                            </div>
                        )}

                        {forgotStep === 1 && (
                            <form onSubmit={handleSendCode} className="login-form">
                                <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '10px' }}>
                                    Entrez votre adresse email pour recevoir un code de vérification.
                                </p>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={forgotEmail}
                                        onChange={e => setForgotEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                    />
                                </div>
                                <button type="submit" className="btn-login" disabled={isForgotLoading}>
                                    {isForgotLoading ? 'Envoi...' : 'Envoyer le code'}
                                </button>
                            </form>
                        )}

                        {forgotStep === 2 && (
                            <form onSubmit={handleVerifyCode} className="login-form">
                                <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '10px' }}>
                                    Veuillez entrer le code à 8 chiffres envoyé à <strong>{forgotEmail}</strong>.
                                    <br />(Expire dans 1 minute)
                                </p>
                                <div className="form-group">
                                    <label>Code de vérification</label>
                                    <input
                                        type="text"
                                        required
                                        value={forgotCode}
                                        onChange={e => setForgotCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                                        placeholder="12345678"
                                        maxLength={8}
                                        style={{ letterSpacing: '2px', textAlign: 'center', fontSize: '18px' }}
                                    />
                                </div>
                                <button type="submit" className="btn-login" disabled={isForgotLoading}>
                                    {isForgotLoading ? 'Vérification...' : 'Vérifier'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForgotStep(1)}
                                    style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginTop: '10px', width: '100%' }}
                                >
                                    Renvoyer le code
                                </button>
                            </form>
                        )}

                        {forgotStep === 3 && (
                            <form onSubmit={handleResetPassword} className="login-form">
                                <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', marginBottom: '10px' }}>
                                    Entrez votre nouveau mot de passe.
                                </p>
                                <div className="form-group">
                                    <label>Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Min 6 caractères"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirmer le mot de passe</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmNewPassword}
                                        onChange={e => setConfirmNewPassword(e.target.value)}
                                        placeholder="Confirmer"
                                    />
                                </div>
                                <button type="submit" className="btn-login" disabled={isForgotLoading}>
                                    {isForgotLoading ? 'Traitement...' : 'Changer le mot de passe'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* 2FA Login Modal */}
            {require2FA && (
                <div className="auth-modal-overlay">
                    <div className="auth-modal-content" style={{ maxWidth: '400px' }}>
                        <h3>Validation 2FA</h3>
                        {message && message.type === 'error' && (
                            <div className="auth-message error">{message.text}</div>
                        )}

                        <form onSubmit={handle2FASubmit} className="login-form">
                            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#64748b' }}>
                                Entrez le code à 6 chiffres de votre application d'authentification.
                            </p>
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={token2FA}
                                    onChange={e => setToken2FA(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 'bold' }}
                                    autoFocus
                                    maxLength={6}
                                />
                            </div>
                            <button type="submit" className="btn-login" disabled={loading2FA}>
                                {loading2FA ? 'Vérification...' : 'Valider la connexion'}
                            </button>
                            <button type="button" onClick={() => setRequire2FA(false)} style={{ background: 'none', border: 'none', width: '100%', marginTop: '10px', cursor: 'pointer', color: '#64748b' }}>
                                Annuler
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 2FA Prompt Modal */}
            {show2FAPrompt && (
                <div className="auth-modal-overlay">
                    <div className="auth-modal-content" style={{ maxWidth: '450px', textAlign: 'center' }}>
                        <div style={{ fontSize: '50px', marginBottom: '15px' }}>🛡️</div>
                        <h3 style={{ marginBottom: '10px' }}>Sécurisez votre compte</h3>
                        <p style={{ color: '#64748b', marginBottom: '25px', lineHeight: '1.6' }}>
                            Nous vous recommandons d'activer l'authentification à deux facteurs (2FA) pour protéger votre compte contre les accès non autorisés.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                className="btn-login"
                                onClick={() => { setShow2FAPrompt(false); setIsSetupOpen(true); }}
                                style={{ background: '#3b82f6', border: 'none' }}
                            >
                                Activer la sécurité 2FA
                            </button>
                            <button
                                className="btn-login"
                                onClick={() => { setShow2FAPrompt(false); setTimeout(() => navigate('/'), 500); }}
                                style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b' }}
                            >
                                Plus tard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2FA Setup Modal */}
            {isSetupOpen && setupUser && (
                <TwoFactorSetup
                    user={setupUser}
                    onClose={() => {
                        setIsSetupOpen(false);
                        setTimeout(() => navigate('/'), 500);
                    }}
                    onUpdateUser={(updatedUser) => {
                        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update stored user
                    }}
                />
            )}

        </div>
    );
}
