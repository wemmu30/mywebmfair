import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Search = ({ cartItems }) => {
  useEffect(() => {
    const handleScroll = () => {
      const search = document.querySelector(".search");
      if (search) {
        search.classList.toggle("active", window.scrollY > 100);
      }
    };

    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect will run only once after the initial render

  return (
    <>
      <section className="search">
        <div className="container c_flex">
          <div className="logo width">
            <Link aria-label="Daraz Home" to="/">
              <img src="/assets/main-logo/Logo.png" alt="" />
            </Link>
          </div>

          <div className="search-box f_flex">
            <i className="fa fa-search"></i>
            <input type="text" placeholder="Search here..." />
            <span>All Categories</span>
          </div>

          <div className="icon f_flex width">
            <Link aria-label="Profile page" to="/profile">
              <img
                src={localStorage.getItem("profileImage") || "/path/to/default-profile-image.png"}
                alt="Profile"
                className="profile-icon"
              />
            </Link>
            <div className="cart">
              <Link to="/cart">
                <i className="fa fa-shopping-bag icon-circle"></i>
                <span>{cartItems.length === 0 ? 0 : cartItems.length}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
