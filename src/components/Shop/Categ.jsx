import React from "react";
import { useNavigate } from 'react-router-dom';

const Categ = () => {
  const data = [
    {
      cateImg: "./assets/brand/brand-1.png",
      cateName: "BO&LOU",
    },
    {
      cateImg: "./assets/brand/brand-2.png",
      cateName: "AnoucPea",
    },
    {
      cateImg: "./assets/brand/brand-3.png",
      cateName: "be good.",
    },
    {
      cateImg: "./assets/brand/brand-2.png",
      cateName: "BANANA REPUBLIC",
    },
  ];

  const navigate = useNavigate();

  const handleBrandClick = (link) => {
    navigate(link);
  };

  const handleViewAllClick = () => {
    navigate("/all-products"); // Navigates to the all products page
  };

  return (
    <>
      <div className="category">
        <div className="chead">
          <h1>Brands</h1>
        </div>
        {data.map((value, index) => {
          return (
            <div
              style={{ display: "flex", borderRadius: "10px", cursor: "pointer" }}
              className="chead"
              key={index}
              onClick={() => handleBrandClick(value.link)} // Go to a filtered product page
            >
              <img src={value.cateImg} alt={value.cateName} />
              <span>{value.cateName}</span>
            </div>
          );
        })}
        <div className="box box2">
          <button onClick={handleViewAllClick}>ดูสินค้าทั้งหมด</button>{/*Navigates to all products*/}
        </div>
      </div>
    </>
  );
};

export default Categ;
