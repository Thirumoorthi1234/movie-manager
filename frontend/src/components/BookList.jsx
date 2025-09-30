import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css"; // ✅ Correct import

const API_URL = "http://localhost:3000/api/books";

function BookList() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", year: "" });
  const [editingBook, setEditingBook] = useState(null);
  const [animateId, setAnimateId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(API_URL);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = { ...form, year: Number(form.year) };
      let updatedBook;

      if (editingBook) {
        updatedBook = await axios.put(`${API_URL}/${editingBook._id}`, bookData);
        setEditingBook(null);
      } else {
        updatedBook = await axios.post(API_URL, bookData);
        updatedBook = { data: { ...bookData, _id: Math.random().toString(36) } }; // temp ID for animation
      }

      setAnimateId(updatedBook.data._id);
      setForm({ title: "", author: "", year: "" });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setForm({ title: book.title, author: book.author, year: book.year });
  };

  return (
    <div className="container">
      <h1>Movie Manager</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Director"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          required
        />
        <button type="submit">{editingBook ? "Update Movie" : "Add Movie"}</button>
      </form>

      <ul className="book-list">
        {books.map((book) => (
          <li
            key={book._id}
            className={`book-item ${animateId === book._id ? "animate-pop" : ""}`}
          >
            <b>{book.title}</b> by {book.author} ({book.year})
            <div className="actions">
              <button onClick={() => handleEdit(book)}>Edit</button>
              <button onClick={() => handleDelete(book._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
