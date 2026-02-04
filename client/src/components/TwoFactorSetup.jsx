import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const TwoFactorSetup = ({ user, onClose, onUpdateUser }) => {
    const [step, setStep] = useState(1); // 1: Intro, 2: scan, 3: verify
    const [secret, setSecret] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/2fa/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user._id })
            });
            const data = await res.json();
            if (data.success) {
                setSecret(data.secret);
                setQrCode(data.qrCode);
                setStep(2);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Erreur serveur");
        }
        setLoading(false);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/2fa/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user._id, token: code })
            });
            const data = await res.json();
            if (data.success) {
                if (onUpdateUser) onUpdateUser({ ...user, twoFactorEnabled: true });
                setStep(3); // Success step
                setTimeout(() => onClose(), 2000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Erreur serveur");
        }
        setLoading(false);
    };

    const handleDisable = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/2fa/disable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user._id })
            });
            const data = await res.json();
            if (data.success) {
                if (onUpdateUser) onUpdateUser({ ...user, twoFactorEnabled: false });
                onClose();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Erreur serveur");
        }
        setLoading(false);
    }

    // Styles tailored for the glassmorphism aesthetic of the site
    return (
        <div className="auth-modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div className="auth-modal-content" onClick={e => e.stopPropagation()} style={{
                background: 'white', padding: '30px', borderRadius: '20px',
                width: '90%', maxWidth: '450px', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <button className="auth-modal-close" onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'
                }}>×</button>
                <div className="auth-modal-header" style={{ marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>Authentification 2FA</h3>
                </div>

                {error && <div className="auth-message error" style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</div>}

                {user.twoFactorEnabled && step !== 3 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>La validation en deux étapes est active sur votre compte.</p>
                        <button onClick={handleDisable} className="btn-login" style={{
                            backgroundColor: '#ef4444', color: 'white', border: 'none',
                            padding: '12px', borderRadius: '8px', width: '100%', marginTop: '15px', cursor: 'pointer'
                        }}>
                            {loading ? 'Traitement...' : 'Désactiver la 2FA'}
                        </button>
                    </div>
                ) : (
                    <>
                        {step === 1 && (
                            <div style={{ padding: '0px 10px', textAlign: 'center' }}>
                                <p style={{ color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
                                    Securisez votre compte avec la validation en deux étapes.
                                    Une fois activée, vous devrez entrer un code généré par votre application d'authentification.
                                </p>
                                <button onClick={handleGenerate} className="btn-login" disabled={loading} style={{
                                    backgroundColor: '#3b82f6', color: 'white', border: 'none',
                                    padding: '12px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold'
                                }}>
                                    {loading ? 'Chargement...' : 'Commencer la configuration'}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div style={{ padding: '0px 10px', textAlign: 'center' }}>
                                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '15px' }}>
                                    Scannez ce QR Code avec Google Authenticator ou Authy.
                                </p>
                                {qrCode && (
                                    <>
                                        <img src={qrCode} alt="QR Code" style={{ width: '200px', borderRadius: '10px', marginBottom: '15px', border: '2px solid #f1f5f9' }} />
                                        <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Clé de configuration</p>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold', color: '#334155' }}>{secret}</p>
                                        </div>
                                    </>
                                )}

                                <form onSubmit={handleVerify}>
                                    <div className="form-group" style={{ marginBottom: '15px', textAlign: 'left' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>Entrez le code à 6 chiffres</label>
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={e => setCode(e.target.value)}
                                            placeholder="Ex: 123456"
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1',
                                                textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold'
                                            }}
                                        />
                                    </div>
                                    <button type="submit" className="btn-login" disabled={loading} style={{
                                        backgroundColor: '#10b981', color: 'white', border: 'none',
                                        padding: '12px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold'
                                    }}>
                                        {loading ? 'Vérification...' : 'Activer'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {step === 3 && (
                            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                                <div style={{ fontSize: '60px', color: '#10b981', marginBottom: '15px' }}>✓</div>
                                <h4 style={{ color: '#0f172a' }}>2FA Activée !</h4>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TwoFactorSetup;
