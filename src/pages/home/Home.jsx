import React from "react";

import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import "./home.css";

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