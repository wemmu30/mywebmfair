import { Routes, Route, Navigate } from "react-router-dom";
import "../App.css";
import Cartpage from "../pages/cartpage/Cartpage";
import Homepage from "../pages/homepage/Homepage";
import Loginpage from "../pages/loginpage/Loginpage";
import Registrationpage from "../pages/registrationpage/Registrationpage";
import Allproductspage from "../pages/all-productspage/Allproductspage";
import Singleproductpage from "../pages/product-details/Singleproductpage";
import ErrorNotFound from "../components/ErrorNotFoundPage/ErrorNotFound";
import ScrollToTop from "../components/ScrollToTop";
import Checkout from "../pages/cartpage/Checkout";
import ProfilePage from "../pages/profilepage/ProfilePage"; // นำเข้า ProfilePage
import Cookies from "js-cookie"; // Import Cookies

const AllRoutes = ({
  productItems,
  cartItems,
  addToCart,
  shopItems,
  deleteFromCart,
  checkOut,
  removeFromCart,
  allProductsData,
}) => {
  // Check if the user is logged in by looking for the token in cookies
  const isLoggedIn = !!Cookies.get("token");

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Homepage
              productItems={productItems}
              cartItems={cartItems}
              addToCart={addToCart}
              shopItems={shopItems}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cartpage
              cartItems={cartItems}
              addToCart={addToCart}
              deleteFromCart={deleteFromCart}
              checkOut={checkOut}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cartItems}
              onPaymentSubmit={(formData) => {
                console.log("Payment Info:", formData);
                checkOut(cartItems);
              }}
            />
          }
        />
        <Route path="/login" element={<Loginpage cartItems={cartItems} />} />
        <Route
          path="/registration"
          element={<Registrationpage cartItems={cartItems} />}
        />
        <Route
          path="/all-products"
          element={
            <Allproductspage
              cartItems={cartItems}
              allProductsData={allProductsData}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/all-products/:id"
          element={
            <Singleproductpage
              cartItems={cartItems}
              allProductsData={allProductsData}
              addToCart={addToCart}
            />
          }
        />
        {/* เพิ่มเส้นทาง profile และตรวจสอบการล็อกอิน */}
        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage cartItems={cartItems} /> : <Navigate to="/login" />}
        />
        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<ErrorNotFound cartItems={cartItems} />} />
      </Routes>
    </>
  );
};

export default AllRoutes;
