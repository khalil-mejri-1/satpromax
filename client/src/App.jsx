import { useEffect } from "react";
import Home from "./pages/home.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import Admin from "./pages/admin.jsx";
import Schema from "./components/SEO/Schema";

import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import GuideInstallation from "./pages/GuideInstallation.jsx";
import GuideDetailPage from "./pages/GuideDetailPage.jsx";

import ContactUs from "./pages/ContactUs.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";

import { ShopContextProvider } from "./context/ShopContext.jsx";

const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.role === 'admin') {
    return children;
  }
  return <Navigate to="/login" />;
};



const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Technoplus",
  "url": "https://satpromax.com",
  "logo": "https://satpromax.com/logo.png",
  "sameAs": [
    "https://www.facebook.com/satpromax",
    "https://www.instagram.com/satpromax"
  ]
};



function App() {
  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", handleContextMenu);
  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);


  return (
    <>
      <ShopContextProvider>
        <BrowserRouter>
          <Schema schema={organizationSchema} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/guide-installation" element={<GuideInstallation />} />
            <Route path="/guide-installation/:slug" element={<GuideDetailPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/support" element={<SupportPage />} />

            <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />

            {/* Dynamic Product and Category Routes */}
            <Route path="/:category/:slug" element={<ProductDetailPage />} />
            <Route path="/:categoryName" element={<ProductsPage />} />

            <Route path="*" element={<Home />} />

          </Routes>
        </BrowserRouter>
      </ShopContextProvider>
    </>
  )
}

export default App
