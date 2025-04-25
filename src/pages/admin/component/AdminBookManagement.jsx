import React, { useState, useEffect } from "react";
import { useProducts } from "../../cart/component/product_Data";
import "./AdminBookManagement.css";

const AdminBookManagement = () => {
  const { products, loading, error } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    newGenre: "", // Added new state for custom genre input
    price: "",
    sale: "",
    promotion: "",
    image: ""
  });
  const [genres, setGenres] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  // Load unique genres for select dropdown
  useEffect(() => {
    if (products && products.length > 0) {
      const allGenres = new Set();
      products.forEach(product => {
        const productGenres = product.genre?.split(',').map(g => g.trim()) || [];
        productGenres.forEach(genre => {
          if (genre) allGenres.add(genre);
        });
      });
      setGenres(Array.from(allGenres));
    }
  }, [products]);

  const handleAddNew = () => {
    setIsAdding(true);
    setCurrentBook(null);
    setFormData({
      title: "",
      author: "",
      genre: "",
      newGenre: "", // Reset new genre field
      price: "",
      sale: "",
      promotion: "",
      image: ""
    });
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setIsAdding(false);
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      newGenre: "", // Reset new genre field
      price: book.price.toString(),
      sale: book.sale ? book.sale.toString() : "",
      promotion: book.promotion || "",
      image: book.image
    });
    setShowModal(true);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const response = await fetch("http://localhost/PHP/admin_books.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_book",
          book_id: bookId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatusMessage({ type: "success", message: "Book deleted successfully" });
        // Force reload books data - in a real app, you'd update the context
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setStatusMessage({ type: "error", message: data.error || "Failed to delete book" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error connecting to server" });
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.author || !formData.price) {
      setStatusMessage({ type: "error", message: "Title, author and price are required" });
      return;
    }

    // Determine the actual genre to use (selected or new)
    const genreToUse = formData.genre === "new" && formData.newGenre ? formData.newGenre : formData.genre;

    // Prepare data for submission
    const bookData = {
      title: formData.title,
      author: formData.author,
      genre: genreToUse,
      price: parseFloat(formData.price),
      sale: formData.sale ? parseFloat(formData.sale) : null,
      promotion: formData.promotion,
      image: formData.image || "placeholder.jpg" // Default image
    };

    try {
      const response = await fetch("http://localhost/PHP/admin_books.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: isAdding ? "add_book" : "update_book",
          book_id: currentBook?.id,
          book_data: bookData
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatusMessage({ 
          type: "success", 
          message: isAdding ? "Book added successfully" : "Book updated successfully" 
        });
        setShowModal(false);
        // Force reload books data - in a real app, you'd update the context
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setStatusMessage({ type: "error", message: data.error || "Operation failed" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error connecting to server" });
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="admin-bookmanage-loading-container">
        <div className="admin-bookmanage-spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-bookmanage-error-container">
        <p>Error loading books: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-bookmanage-container">
      <div className="admin-bookmanage-header">
        <h2>Book Management</h2>
        <button className="admin-bookmanage-add-btn" onClick={handleAddNew}>Add New Book</button>
      </div>

      {statusMessage.message && (
        <div className={`admin-bookmanage-status-message admin-bookmanage-${statusMessage.type}`}>
          {statusMessage.message}
        </div>
      )}

      <div className="admin-bookmanage-table-container">
        <table className="admin-bookmanage-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Price (VND)</th>
              <th>Sale Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>
                  <img 
                    src={`/images/${book.image}`} 
                    alt={book.title}
                    className="admin-bookmanage-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.price.toLocaleString()}</td>
                <td>{book.sale ? book.sale.toLocaleString() : "-"}</td>
                <td>
                  <div className="admin-bookmanage-actions">
                    <button 
                      className="admin-bookmanage-edit-btn"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button 
                      className="admin-bookmanage-delete-btn"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-bookmanage-modal-backdrop">
          <div className="admin-bookmanage-modal-content">
            <h3>{isAdding ? "Add New Book" : "Edit Book"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-bookmanage-form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-bookmanage-form-group">
                <label>Author:</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-bookmanage-form-group">
                <label>Genre:</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                >
                  <option value="">Select Genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                  <option value="new">Add New Genre...</option>
                </select>
                {formData.genre === "new" && (
                  <input
                    type="text"
                    name="newGenre"
                    value={formData.newGenre}
                    placeholder="Enter new genre"
                    onChange={handleInputChange}
                    className="admin-bookmanage-mt-2"
                  />
                )}
              </div>

              <div className="admin-bookmanage-form-group">
                <label>Price (VND):</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-bookmanage-form-group">
                <label>Sale Price (VND, optional):</label>
                <input
                  type="number"
                  name="sale"
                  value={formData.sale}
                  onChange={handleInputChange}
                />
              </div>

              <div className="admin-bookmanage-form-group">
                <label>Promotion (optional):</label>
                <input
                  type="text"
                  name="promotion"
                  value={formData.promotion}
                  onChange={handleInputChange}
                />
              </div>

              <div className="admin-bookmanage-form-group">
                <label>Image Filename:</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="e.g., book1.jpg"
                />
                <small>Image should be in the /images/ folder</small>
              </div>

              <div className="admin-bookmanage-modal-buttons">
                <button type="submit" className="admin-bookmanage-save-btn">Save</button>
                <button 
                  type="button" 
                  className="admin-bookmanage-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookManagement;