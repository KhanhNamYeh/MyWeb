import React from "react";

// Điều chỉnh import Navbar, Footer, và CSS sang đường dẫn mới
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import "./home.css";

//Thanh Search nằm trong component ProductList
import ProductList from "./component/ProductList";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <ProductList />
      <Footer />
    </div>
  );
};

export default Home;
