import { useEffect, useState } from "react";
import axios from "axios";
import iconEditTable from "../assets/images/iconEditTable.svg";
import iconDelete from "../assets/images/iconDelete.svg";
import iconEdit from "../assets/images/iconEdit.svg";
import iconInsert from "../assets/images/iconInsert.svg";

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
      const response = await axios.delete(`http://localhost:5001/books/${book.title}`);
      if (response.data.message === "Book deleted successfully") {
        const updatedResponse = await axios.get("http://localhost:5001/books");
        setBooks(updatedResponse.data.books);
        setDeleteConfirmation(null);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 contain-layout hover:shadow-purple-500/10 hover:border-white/30 transition-all duration-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Book List</h2>
      <div className="overflow-x-auto rounded-xl contain-paint">
        <table className="min-w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-gray-800">
              <th className="border-b border-white/20 p-4 text-left font-semibold">ID</th>
              <th className="border-b border-white/20 p-4 text-left font-semibold">Image</th>
              <th className="border-b border-white/20 p-4 text-left font-semibold">Title</th>
              <th className="border-b border-white/20 p-4 text-left font-semibold">Author</th>
              <th className="border-b border-white/20 p-4 text-right">
                <img
                  src={iconEditTable}
                  alt="Toggle Actions"
                  className={`w-6 h-6 cursor-pointer hover:opacity-80 inline-block transition-transform duration-300 ${showActions ? 'rotate-180' : ''}`}
                  onClick={toggleActions}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index} className="border-b border-white/10 hover:bg-white/10 transition-all duration-300">
                <td className="p-4 text-gray-800">{index + 1}</td>
                <td className="p-4">
                  <img src={book.image_url} alt={book.title} className="h-20 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-purple-500/20" />
                </td>
                <td className="p-4 font-semibold text-gray-800">{book.title}</td>
                <td className="p-4 text-gray-700">{book.author}</td>
                <td className="p-3 text-right">
                  {showActions && (
                    <div className="flex justify-end gap-4 p-2 animate-fade-in">
                      <button
                        className="p-2 hover:bg-white/50 rounded-full transition-all duration-200"
                        onClick={() => handleEdit(book)}
                      >
                        <img
                          src={iconEdit}
                          alt="Edit"
                          className="w-6 h-6 transform hover:scale-110 transition-all duration-200"
                        />
                      </button>
                      <button
                        className="p-2 hover:bg-white/50 rounded-full transition-all duration-200"
                        onClick={() => setDeleteConfirmation(book)}
                      >
                        <img
                          src={iconDelete}
                          alt="Delete"
                          className="w-6 h-6 transform hover:scale-110 transition-all duration-200"
                        />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingBook && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-96 border border-white/20 transform transition-all duration-300 animate-modal-in hover:shadow-purple-500/10 hover:border-white/30">
            <h3 className="text-2xl font-bold mb-6 text-white">Edit Book</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 rounded-xl border border-white/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={editForm.author}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 rounded-xl border border-white/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={editForm.image_url}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 rounded-xl border border-white/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setEditingBook(null)}
                  className="px-6 py-2 text-sm font-medium text-white/90 bg-white/10 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-500/20"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-96 border border-white/20 transform transition-all duration-300 animate-modal-in hover:shadow-purple-500/10 hover:border-white/30">
            <h3 className="text-2xl font-bold mb-4 text-white">Confirm Delete</h3>
            <p className="text-white/70 mb-6">Are you sure you want to delete "{deleteConfirmation.title}"?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-6 py-2 text-sm font-medium text-white/90 bg-white/10 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation)}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600/80 to-pink-600/80 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-red-500/20"
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
