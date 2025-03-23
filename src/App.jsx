import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AllRoutes from "./allroutes/AllRoutes";
import FlashDealsData from "./components/FlashDeals/flashDealsData";
import ShopData from "./components/Shop/shopData";
import AllProductsData from "./components/Allproducts/allProductsData";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import Profile from "./components/Profile/Profile";
import { UserProvider } from "./context/UserContext";
import "./App.css";

const AppContent = () => {
  const navigate = useNavigate();

  // ตรวจสอบว่าข้อมูล import มาแล้วจริงหรือไม่
  console.log("FlashDealsData:", FlashDealsData);
  console.log("ShopData:", ShopData);
  console.log("AllProductsData:", AllProductsData);

  // ตรวจสอบว่าข้อมูลมาจากไฟล์ได้ถูกต้อง
  const productItems = FlashDealsData?.productItems || [];
  const shopItems = ShopData?.shopItems || [];
  const allProductsData = AllProductsData?.allProductsData || [];

  // State ของตะกร้าสินค้า
  const [cartItems, setCartItems] = useState([]);

  // เช็คว่าผู้ใช้ล็อกอินหรือไม่
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    console.log("App component mounted");
  }, []);

  const handleLogin = (token) => {
    Cookies.set("token", token);
    setIsLoggedIn(true);
    navigate("/profile");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const addToCart = (product) => {
    const productExists = cartItems.find((item) => item.id === product.id);
    if (productExists) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...productExists, qty: productExists.qty + 1 } : item
        )
      );
      toast.success("Item quantity increased");
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
      toast.success("Item added to cart");
    }
  };

  const deleteFromCart = (product) => {
    const productExists = cartItems.find((item) => item.id === product.id);
    if (productExists.qty === 1) {
      const shouldRemove = window.confirm("Are you sure you want to remove this item from the cart?");
      if (shouldRemove) {
        setCartItems(cartItems.filter((item) => item.id !== product.id));
        toast.success("Item removed from cart");
      }
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...productExists, qty: productExists.qty - 1 } : item
        )
      );
      toast.success("Item quantity decreased");
    }
  };

  const checkOut = () => {
    if (isLoggedIn) {
      if (cartItems.length <= 0) {
        toast.error("Add an item in the cart to checkout");
      } else {
        const confirmOrder = window.confirm("Are you sure you want to order all these products?");
        if (confirmOrder) {
          setCartItems([]);
          toast.success("Order placed, Thanks!!");
        }
      }
    } else {
      toast("You must login first!", { icon: "🤯" });
      navigate("/login", { replace: true });
    }
  };

  const removeFromCart = (product) => {
    const shouldRemove = window.confirm("Are you sure you want to remove this item from the cart?");
    if (shouldRemove) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
      toast.success("Item removed from cart");
    }
  };

  return (
    <>
      <Toaster />
      <AllRoutes
        removeFromCart={removeFromCart}
        productItems={productItems}
        cartItems={cartItems}
        addToCart={addToCart}
        shopItems={shopItems}
        deleteFromCart={deleteFromCart}
        checkOut={checkOut}
        allProductsData={allProductsData}
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;