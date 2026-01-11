import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]); // Initial empty state

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Fetch User Orders
            fetch(`https://satpromax.com/api/orders/user/${parsedUser.id || parsedUser._id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setOrders(data.data.map(order => ({
                            _id: order._id,
                            id: order._id,
                            date: new Date(order.createdAt).toLocaleDateString(),
                            status: order.status,
                            total: order.totalAmount + ' DT',
                            items: order.items // Keep full items array
                        })));
                    }
                })
                .catch(err => console.error("Error fetching orders:", err));

        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <>
            <Header />
            <div className="profile-page-container">
                <div className="container">
                    <div className="profile-header">
                        <h1 className="page-title">Mon Profil</h1>
                        <p className="page-subtitle">Gérez vos informations et consultez vos commandes.</p>
                    </div>

                    <div className="profile-grid">
                        {/* User Information Card */}
                        <div className="profile-card user-info-card">
                            <div className="card-header">
                                <h3>Informations Personnelles</h3>
                            </div>
                            <div className="card-body">
                                <div className="profile-avatar">
                                    <span className="avatar-initials">{user.username.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <div className="info-group">
                                    <label>Nom d'utilisateur</label>
                                    <p>{user.username}</p>
                                </div>
                                <div className="info-group">
                                    <label>Email</label>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Orders Section */}
                        <div className="profile-card orders-card">
                            <div className="card-header">
                                <h3>Mes Commandes</h3>
                            </div>
                            <div className="card-body">
                                {orders.length > 0 ? (
                                    <div className="orders-list">
                                        {orders.map(order => (
                                            <div key={order._id} className="order-item">
                                                <div className="order-products-preview">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="order-product-mini">
                                                            <img src={item.image} alt={item.name} title={item.name} />
                                                            <span className="product-mini-name">{item.name} (x{item.quantity})</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="order-meta-info">
                                                    <div className="meta-row">
                                                        <span className="meta-label">Date:</span>
                                                        <span className="meta-value">{order.date}</span>
                                                    </div>
                                                    <div className="meta-row">
                                                        <span className="meta-label">Total:</span>
                                                        <span className="meta-value total-price">{order.total}</span>
                                                    </div>
                                                    <div className="meta-row">
                                                        <span className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-orders">
                                        <div className="empty-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="9" cy="21" r="1"></circle>
                                                <circle cx="20" cy="21" r="1"></circle>
                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                            </svg>
                                        </div>
                                        <p>Vous n'avez pas encore passé de commande.</p>
                                        <button className="btn btn-yellow go-shopping-btn" onClick={() => navigate('/')}>
                                            Aller faire du shopping
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
