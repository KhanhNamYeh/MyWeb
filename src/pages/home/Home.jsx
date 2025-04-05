import React from "react";

// Điều chỉnh import Navbar, Footer, và CSS sang đường dẫn mới
import Navbar from "../HeadAndFooter/Navbar";
import Footer from "../HeadAndFooter/Footer";
import "./home.css";

// SearchBar và BookList vẫn nằm trong thư mục `home`
import SearchBar from "./component/SearchBar";
import BookList from "./component/BookList";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <SearchBar />
      <BookList />
      <Footer />
    </div>
  );
};

export default Home;
