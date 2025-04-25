import React from "react";
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import AboutUs from "./component/AboutUs";
import ProductList from "./component/ProductList";
import Banner from "./component/Banner"; // Import the new Banner component
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <Banner /> {/* Add the Banner component here */}
      <ProductList />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default Home;