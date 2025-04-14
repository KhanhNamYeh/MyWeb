import React from "react";
import "../home.css";

const ProductItem = ({ book }) => {
  return (
    <div className="book-item">
      <img src={`/images/${book.image}`} alt={book.title} className="book-image" />
      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
    </div>
  );
};

export default ProductItem;