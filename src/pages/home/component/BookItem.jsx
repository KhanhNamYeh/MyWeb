import React from "react";
import "../home.css";

const BookItem = ({ book }) => {
  return (
    <div className="book-item">
      <img src={`/images/${book.image}`} alt={book.title} className="book-image" />
      <h3>{book.title}</h3>
      <p>Tác giả: {book.author}</p>
    </div>
  );
};

export default BookItem;
