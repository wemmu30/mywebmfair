import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Loginform from "../../components/Loginform/Loginform";
import Footer from "../../components/Footer/Footer";
import Cookies from "js-cookie"; // To check the token status

const Loginpage = ({ cartItems }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in (using token)
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Header cartItems={cartItems} isLoggedIn={isLoggedIn} />
      <Loginform />
      <Footer />
    </>
  );
};

export default Loginpage;
