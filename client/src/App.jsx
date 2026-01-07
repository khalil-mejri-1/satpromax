import Home from "./pages/home.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import Admin from "./pages/admin.jsx";

import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { ShopContextProvider } from "./context/ShopContext.jsx";

function App() {

  return (
    <>
      <ShopContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/admin" element={<Admin />} />

            <Route path="*" element={<Home />} />

          </Routes>
        </BrowserRouter>
      </ShopContextProvider>
    </>
  )
}

export default App
