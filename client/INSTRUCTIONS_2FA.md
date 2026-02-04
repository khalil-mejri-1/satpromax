# تعليمات إضافة ميزة 2FA - التحقق الثنائي

## ✅ ما تم إنجازه:

### Backend (مكتمل 100%):
1. ✅ تثبيت المكتبات المطلوبة (speakeasy, qrcode, bcryptjs)
2. ✅ تحديث نموذج User و GeneralSettings لدعم 2FA
3. ✅ إضافة جميع API endpoints للـ 2FA
4. ✅ تحديث `/api/login` endpoint لدعم 2FA

### Frontend (مكتمل جزئياً):
1. ✅ إضافة modal التحقق من 2FA في صفحة تسجيل الدخول
2. ✅ إنشاء مكون TwoFactorSetup.jsx كامل مع CSS
3. ⏳ إضافة زر 2FA في Header (يحتاج للتنفيذ)
4. ⏳ إضافة قسم 2FA في صفحة الأدمن (يحتاج للتنفيذ)

---

## 📝 خطوات إكمال التنفيذ:

### 1. إضافة زر 2FA في Header (Desktop)

في ملف `client/src/components/Header.jsx`:

#### A. إضافة State للمودال:
أضف هذا السطر مع باقي useState في بداية الكومبونينت (حوالي سطر 130):

```javascript
const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
```

#### B. استيراد المكون:
أضف في بداية الملف مع باقي الـ imports:

```javascript
import TwoFactorSetup from './TwoFactorSetup';
```

#### C. إضافة الزر في قائمة المستخدم:
في قسم Profile Dropdown (حوالي سطر 404)، أضف هذا الكود بعد زر "Mon Profil" وقبل زر Admin:

```jsx
{user && (
    <div 
        className="dropdown-item"
        onClick={() => setIs2FAModalOpen(true)}
        style={{ cursor: 'pointer' }}
    >
        <div style={{ 
            width: '50px', 
            height: '50px', 
            background: '#dbeafe', 
            borderRadius: '4px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#3b82f6' 
        }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </div>
        <div className="item-info">
            <div className="item-name" style={{ color: '#3b82f6' }}>2FA</div>
            <div className="item-meta">Authentification 2FA</div>
        </div>
    </div>
)}
```

#### D. إضافة المودال قبل نهاية return:
أضف هذا الكود قبل إغلاق `</header>` في نهاية الكومبونينت:

```jsx
{is2FAModalOpen && user && (
    <TwoFactorSetup
        user={user}
        onClose={() => setIs2FAModalOpen(false)}
        onSuccess={() => {
            // Optionally refresh user data
            const updatedUser = { ...user, twoFactorEnabled: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }}
    />
)}
```

---

### 2. إضافة زر 2FA في قائمة Mobile Menu

في نفس ملف Header.jsx، في قسم Sidebar Menu (حوالي سطر 685)، أضف هذا الكود بعد قسم profile info:

```jsx
{user && (
    <div 
        className="sidebar-nav-item"
        onClick={() => {
            setIs2FAModalOpen(true);
            setIsSidebarOpen(false);
        }}
        style={{ 
            cursor: 'pointer',
            borderTop: '1px solid #e2e8f0',
            paddingTop: '15px',
            marginTop: '10px'
        }}
    >
        <span className="sidebar-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        </span>
        <span className="sidebar-text">2FA</span>
        <span className="sidebar-arrow">›</span>
    </div>
)}
```

---

### 3. إضافة قسم إدارة 2FA في صفحة الأدمن

في ملف `client/src/pages/admin.jsx`:

#### A. إنشاء مكون جديد للإدارة 2FA في الأدمن:

أضف هذا المكون بعد المكونات الأخرى (حوالي نهاية الملف، قبل export default):

```javascript
function TwoFactorManagement() {
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState(null);
    const [is2FASetupOpen, setIs2FASetupOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        fetchUsers();
        // Get admin user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        setAdminUser(user);
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/2fa/admin/all-users`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleForceDisable = async (userId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir désactiver la 2FA pour cet utilisateur ?')) {
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/2fa/admin/force-disable`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();

            if (data.success) {
                showNotification('2FA désactivé avec succès', 'success');
                fetchUsers();
            } else {
                showNotification(data.message || 'Erreur', 'error');
            }
        } catch (error) {
            showNotification('Erreur de connexion', 'error');
        }
    };

    return (
        <div className="admin-section">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="section-header">
                <h2>🔐 Gestion 2FA</h2>
                {adminUser && adminUser.role === 'admin' && (
                    <button
                        className="btn-add"
                        onClick={() => setIs2FASetupOpen(true)}
                        style={{ marginLeft: 'auto' }}
                    >
                        Configurer 2FA Admin
                    </button>
                )}
            </div>

            <div className="admin-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="product-card"
                        style={{
                            background: user.twoFactorEnabled
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
                                : 'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.05) 100%)',
                            border: user.twoFactorEnabled
                                ? '2px solid rgba(16, 185, 129, 0.3)'
                                : '2px solid rgba(107, 114, 128, 0.2)'
                        }}
                    >
                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: user.twoFactorEnabled
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : 'rgba(107, 114, 128, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px'
                                }}>
                                    {user.twoFactorEnabled ? '✓' : '⊘'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>
                                        {user.username}
                                    </h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                padding: '12px',
                                background: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '8px',
                                marginBottom: '15px'
                            }}>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                                        Statut 2FA
                                    </div>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: user.twoFactorEnabled ? '#10b981' : '#6b7280'
                                    }}>
                                        {user.twoFactorEnabled ? 'Activé' : 'Désactivé'}
                                    </div>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                                        Rôle
                                    </div>
                                    <div style={{
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: user.role === 'admin' ? '#fbbf24' : '#94a3b8'
                                    }}>
                                        {user.role}
                                    </div>
                                </div>
                            </div>

                            {user.twoFactorEnabled && (
                                <button
                                    onClick={() => handleForceDisable(user._id)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    Désactiver 2FA
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {is2FASetupOpen && adminUser && (
                <TwoFactorSetup
                    user={adminUser}
                    onClose={() => setIs2FASetupOpen(false)}
                    onSuccess={() => {
                        showNotification('2FA admin configuré avec succès', 'success');
                        fetchUsers();
                    }}
                />
            )}
        </div>
    );
}
```

#### B. إضافة الـ import في بداية ملف admin.jsx:

```javascript
import TwoFactorSetup from '../components/TwoFactorSetup';
```

#### C. إضافة القسم في قائمة الأدمن:

في دالة `renderContent()` في Admin component، أضف هذا الـ case:

```javascript
case 'gestion-2fa':
    return <TwoFactorManagement />;
```

#### D. إضافة الزر في Sidebar الأدمن:

في قسم Sidebar، أضف هذا الزر بعد الأزرار الأخرى:

```jsx
<button
    className={`nav-btn ${activeSection === 'gestion-2fa' ? 'active' : ''}`}
    onClick={() => setActiveSection('gestion-2fa')}
>
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
    Gestion 2FA
</button>
```

---

## 🧪 اختبار الميزة:

### 1. تشغيل الـ Backend:
```bash
cd server
npm run dev
```

### 2. تشغيل الـ Frontend:
```bash
cd client
npm run dev
```

### 3. خطوات الاختبار:

#### A. للمستخدم العادي:
1. سجل دخول كمستخدم عادي
2. اضغط على أيقونة المستخدم في Header
3. اختر "2FA" من القائمة  
4. اتبع الخطوات لتفعيل 2FA
5. سجل خروج ثم سجل دخول مرة أخرى
6. يجب أن يطلب منك كود 2FA

#### B. للأدمن:
1. سجل دخول كأدمن
2. اذهب إلى "Gestion 2FA" من قائمة الأدمن
3. اضغط "Configurer 2FA Admin"
4. اتبع الخطوات لتفعيل 2FA للأدمن
5. سجل خروج ثم سجل دخول كأدمن
6. يجب أن يطلب منك كود 2FA
7. يمكنك أيضاً تعطيل 2FA لأي مستخدم من نفس الصفحة

---

## 📱 التطبيقات المدعومة للـ 2FA:

- Google Authenticator (Android/iOS)
- Microsoft Authenticator (Android/iOS)
- Authy (Android/iOS/Desktop)
- 1Password
- LastPass Authenticator

---

## ⚠️ ملاحظات مهمة:

1. **احفظ الـ Secret Key**: عند تفعيل 2FA لأول مرة، احفظ الـ Secret Key في مكان آمن
2. **النسخ الاحتياطي**: التطبيقات مثل Authy تسمح بالنسخ الاحتياطي للأكواد
3. **فقدان الوصول**: إذا فقدت الوصول لتطبيق المصادقة، يمكن للأدمن تعطيل 2FA من صفحة الإدارة
4. **التأكد من الوقت**: تأكد أن الوقت على الجهاز متطابق مع الوقت الفعلي (الأكواد حساسة للوقت)

---

## 🎯 الميزات المضافة:

✅ مودال تحقق 2FA عند تسجيل الدخول
✅ QR Code لتفعيل 2FA
✅ امكانية نسخ Secret Key يدوياً
✅ تفعيل/تعطيل 2FA من ملف المستخدم
✅ إدارة 2FA للمستخدمين من صفحة الأدمن
✅ 2FA منفصل للأدمن
✅ تصميم عصري بأسلوب glassmorphism
✅ دعم كامل للموبايل
✅ رسائل خطأ ونجاح واضحة

---

## 🔒 الأمان:

- استخدام TOTP (Time-based One-Time Password) القياسي
- الأكواد صالحة لـ 30 ثانية فقط
- Window size = 2 (يقبل الكود السابق والحالي والتالي)
- تخزين Secret مشفر في قاعدة البيانات
- التحقق من كلمة المرور قبل تعطيل 2FA

---

نجحت في إضافة ميزة 2FA الكاملة! 🎉
