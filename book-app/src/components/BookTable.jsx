import { useEffect, useState } from "react";
import axios from "axios";
import iconEditTable from "../assets/images/iconEditTable.svg";
import iconDelete from "../assets/images/iconDelete.svg";
import iconEdit from "../assets/images/iconEdit.svg";

const BookTable = ({ refreshTrigger }) => {
  const [books, setBooks] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    image_url: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5001/books")
      .then(response => setBooks(response.data.books))
      .catch(error => console.error("Error fetching books:", error));
  }, [refreshTrigger]);

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      image_url: book.image_url
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5001/books/${editingBook.title}`, editForm);
      const updatedBooks = books.map(book =>
        book.title === editingBook.title ? { ...editForm } : book
      );
      setBooks(updatedBooks);
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDelete = async (book) => {
    try {
      await axios.delete(`http://localhost:5001/books/${book.title}`);
      setBooks(books.filter(b => b.title !== book.title));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/30 rounded-xl shadow-xl p-6 border border-white/20">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Book List</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white/40 backdrop-blur-sm border border-white/30">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500/40 to-blue-500/40 text-white">
              <th className="border-b border-white/30 p-3 text-left">ID</th>
              <th className="border-b border-white/30 p-3 text-left">Image</th>
              <th className="border-b border-white/30 p-3 text-left">Title</th>
              <th className="border-b border-white/30 p-3 text-left">Author</th>
              <th className="border-b border-white/30 p-3 text-right">
                <img
                  src={iconEditTable}
                  alt="Toggle Actions"
                  className={`w-6 h-6 cursor-pointer hover:opacity-80 inline-block transition-all duration-200 ${showActions ? 'filter hue-rotate-180 brightness-110' : ''}`}
                  onClick={toggleActions}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index} className="border-b border-white/20 hover:bg-white/50 transition-all duration-200">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <img src={book.image_url} alt={book.title} className="h-20 rounded-lg shadow-md hover:scale-105 transition-transform duration-200" />
                </td>
                <td className="p-3 font-semibold text-gray-800">{book.title}</td>
                <td className="p-3 text-gray-600">{book.author}</td>
                <td className="p-3 text-right">
                  {showActions && (
                    <div className="flex justify-end gap-2">
                      <img
                        src={iconEdit}
                        alt="Edit"
                        className="w-6 h-6 cursor-pointer hover:opacity-80"
                        onClick={() => handleEdit(book)}
                      />
                      <img
                        src={iconDelete}
                        alt="Delete"
                        className="w-6 h-6 cursor-pointer hover:opacity-80"
                        onClick={() => setDeleteConfirmation(book)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Edit Book</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={editForm.author}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={editForm.image_url}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete "{deleteConfirmation.title}"?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;
