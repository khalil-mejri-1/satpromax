import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import './TwoFactorSetup.css';

export default function TwoFactorSetup({ user, onClose, onSuccess }) {
    const [step, setStep] = useState('status'); // 'status', 'setup', 'verify', 'disable'
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    useEffect(() => {
        checkStatus();
    }, [user]);

    const checkStatus = async () => {
        try {
            const endpoint = user.role === 'admin'
                ? '/api/2fa/admin/status'
                : `/api/2fa/status/${user.id}`;

            const res = await fetch(`${API_BASE_URL}${endpoint}`);
            const data = await res.json();

            if (data.success) {
                setTwoFactorEnabled(data.twoFactorEnabled);
            }
        } catch (error) {
            console.error('Error checking 2FA status:', error);
        }
    };

    const handleSetup = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const endpoint = user.role === 'admin'
                ? '/api/2fa/admin/setup'
                : '/api/2fa/setup';

            const body = user.role === 'admin' ? {} : { userId: user.id };

            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.success) {
                setQrCode(data.qrCode);
                setSecret(data.secret);
                setStep('verify');
            } else {
                setMessage({ type: 'error', text: data.message || 'Erreur de configuration' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
        }

        setLoading(false);
    };

    const handleVerifyAndEnable = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const endpoint = user.role === 'admin'
                ? '/api/2fa/admin/verify-enable'
                : '/api/2fa/verify-enable';

            const body = user.role === 'admin'
                ? { token: verificationCode }
                : { userId: user.id, token: verificationCode };

            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: '2FA activé avec succès !' });
                setTwoFactorEnabled(true);
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    setStep('status');
                    setVerificationCode('');
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.message || 'Code invalide' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de vérification' });
        }

        setLoading(false);
    };

    const handleDisable = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const endpoint = user.role === 'admin'
                ? '/api/2fa/admin/disable'
                : '/api/2fa/disable';

            const body = user.role === 'admin'
                ? { password }
                : { userId: user.id, password };

            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: '2FA désactivé avec succès !' });
                setTwoFactorEnabled(false);
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                    setStep('status');
                    setPassword('');
                }, 1500);
            } else {
                setMessage({ type: 'error', text: data.message || 'Mot de passe incorrect' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur de désactivation' });
        }

        setLoading(false);
    };

    return (
        <div className="twofa-modal-overlay" onClick={onClose}>
            <div className="twofa-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="twofa-modal-close" onClick={onClose}>×</button>

                <div className="twofa-modal-header">
                    <h2>🔐 Authentification à deux facteurs</h2>
                </div>

                {message && (
                    <div className={`twofa-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {step === 'status' && (
                    <div className="twofa-status">
                        <div className={`status-indicator ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                            <div className="status-icon">
                                {twoFactorEnabled ? '✓' : '⊘'}
                            </div>
                            <div className="status-text">
                                <h3>2FA {twoFactorEnabled ? 'Activé' : 'Désactivé'}</h3>
                                <p>
                                    {twoFactorEnabled
                                        ? 'Votre compte est protégé par l\'authentification à deux facteurs.'
                                        : 'Activez la 2FA pour une sécurité renforcée de votre compte.'}
                                </p>
                            </div>
                        </div>

                        <div className="twofa-info">
                            <h4>📱 Qu'est-ce que la 2FA ?</h4>
                            <p>
                                L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire en demandant
                                un code de vérification depuis votre application d'authentification lors de la connexion.
                            </p>
                            <ul>
                                <li>Protection renforcée contre les accès non autorisés</li>
                                <li>Utilisation d'applications comme Google Authenticator ou Authy</li>
                                <li>Codes temporaires qui changent toutes les 30 secondes</li>
                            </ul>
                        </div>

                        {twoFactorEnabled ? (
                            <button
                                className="twofa-btn twofa-btn-danger"
                                onClick={() => setStep('disable')}
                            >
                                Désactiver 2FA
                            </button>
                        ) : (
                            <button
                                className="twofa-btn twofa-btn-primary"
                                onClick={handleSetup}
                                disabled={loading}
                            >
                                {loading ? 'Configuration...' : 'Activer 2FA'}
                            </button>
                        )}
                    </div>
                )}

                {step === 'verify' && (
                    <div className="twofa-setup">
                        <h3>Scannez le QR Code</h3>
                        <p style={{ color: '#64748b', marginBottom: '20px' }}>
                            Utilisez votre application d'authentification pour scanner ce QR code.
                        </p>

                        <div className="qr-code-container">
                            <img src={qrCode} alt="QR Code" className="qr-code-image" />
                        </div>

                        <div className="secret-key-container">
                            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>
                                Ou entrez manuellement cette clé :
                            </p>
                            <div className="secret-key">
                                <code>{secret}</code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(secret);
                                        setMessage({ type: 'success', text: 'Clé copiée !' });
                                        setTimeout(() => setMessage(null), 2000);
                                    }}
                                    className="copy-btn"
                                >
                                    📋
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleVerifyAndEnable} className="twofa-form">
                            <div className="twofa-form-group">
                                <label>Code de vérification</label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                    autoFocus
                                    style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}
                                />
                                <p className="input-hint">
                                    Entrez le code à 6 chiffres affiché dans votre application
                                </p>
                            </div>

                            <div className="twofa-actions">
                                <button
                                    type="button"
                                    className="twofa-btn twofa-btn-secondary"
                                    onClick={() => {
                                        setStep('status');
                                        setVerificationCode('');
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="twofa-btn twofa-btn-primary"
                                    disabled={loading || verificationCode.length !== 6}
                                >
                                    {loading ? 'Vérification...' : 'Vérifier et Activer'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {step === 'disable' && (
                    <div className="twofa-disable">
                        <div className="warning-box">
                            <h3>⚠️ Attention</h3>
                            <p>
                                Vous êtes sur le point de désactiver l'authentification à deux facteurs.
                                Cela rendra votre compte moins sécurisé.
                            </p>
                        </div>

                        <form onSubmit={handleDisable} className="twofa-form">
                            <div className="twofa-form-group">
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Entrez votre mot de passe"
                                    required
                                    autoFocus
                                />
                                <p className="input-hint">
                                    Veuillez confirmer votre mot de passe pour désactiver la 2FA
                                </p>
                            </div>

                            <div className="twofa-actions">
                                <button
                                    type="button"
                                    className="twofa-btn twofa-btn-secondary"
                                    onClick={() => {
                                        setStep('status');
                                        setPassword('');
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="twofa-btn twofa-btn-danger"
                                    disabled={loading}
                                >
                                    {loading ? 'Désactivation...' : 'Désactiver 2FA'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
