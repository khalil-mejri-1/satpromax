import { useEffect } from "react";
import Home from "./pages/home.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import Admin from "./pages/admin.jsx";

import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import GuideInstallation from "./pages/GuideInstallation.jsx";
import GuideDetailPage from "./pages/GuideDetailPage.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";

import { ShopContextProvider } from "./context/ShopContext.jsx";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.role === 'admin') {
    return children;
  }
  return <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);


  return (
    <>
      <ShopContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<ProductsPage />} />
            <Route path="/produit/:category/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/guide-installation" element={<GuideInstallation />} />
            <Route path="/guide-installation/:slug" element={<GuideDetailPage />} />
            <Route path="/contact" element={<ContactUs />} />

            <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />

            <Route path="*" element={<Home />} />

          </Routes>
        </BrowserRouter>
      </ShopContextProvider>
    </>
  )
}

export default App
