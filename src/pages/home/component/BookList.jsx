import React from "react";
import BookItem from "./BookItem";
import "../home.css";

// Dữ liệu sách, vẫn giữ nguyên sách cũ và thêm sách mới cho thể loại "Kinh Dị"
const books = [
  { image: "erasure.jpg", title: "Erasure", author: "Percival Everett", genre: "Thiếu Nhi" },
  { image: "harlem_shuffle.jpg", title: "Harlem Shuffle", author: "Colson Whitehead", genre: "Thiếu Nhi" },
  { image: "native_nations.jpg", title: "Native Nations", author: "Kathleen Duval", genre: "Thiếu Nhi" },
  { image: "this_motherless_land.jpg", title: "This Motherless Land", author: "Nikki May", genre: "Thiếu Nhi" },

  // Thêm sách giả định cho thể loại "Kinh Dị"
  { image: "erasure.jpg", title: "The Haunting", author: "Shirley Jackson", genre: "Kinh Dị" },
  { image: "harlem_shuffle.jpg", title: "It", author: "Stephen King", genre: "Kinh Dị" },
  { image: "native_nations.jpg", title: "Dracula", author: "Bram Stoker", genre: "Kinh Dị" },
  { image: "this_motherless_land.jpg", title: "Pet Sematary", author: "Stephen King", genre: "Kinh Dị" }
];

const BookList = () => {
  // Tách sách theo thể loại
  const childrenBooks = books.filter(book => book.genre === "Thiếu Nhi");
  const horrorBooks = books.filter(book => book.genre === "Kinh Dị");

  return (
    <div className="book-list">
      {/* Hiển thị sách thể loại Thiếu Nhi */}
      <h2>Thiếu Nhi</h2>
      <div className="books-container">
        {childrenBooks.map((book, index) => (
          <BookItem key={index} book={book} />
        ))}
      </div>

      {/* Hiển thị sách thể loại Kinh Dị */}
      <h2>Kinh Dị</h2>
      <div className="books-container">
        {horrorBooks.map((book, index) => (
          <BookItem key={index} book={book} />
        ))}
      </div>

      {/* Hiển thị các sách khác nếu có */}
      {/* Bạn có thể thêm thể loại khác ở đây nếu cần */}
    </div>
  );
};

export default BookList;
