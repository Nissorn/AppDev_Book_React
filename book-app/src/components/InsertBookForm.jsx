import { useState } from 'react';
import axios from 'axios';
import iconInsert from "../assets/images/iconInsert.svg";

const InsertBookForm = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    image_url: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setPopupMessage('Please enter a title');
      return false;
    }
    if (!formData.author.trim()) {
      setPopupMessage('Please enter an author');
      return false;
    }
    if (!formData.image_url.trim()) {
      setPopupMessage('Please enter an image URL');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    try {
      await axios.post('http://localhost:5001/books', formData);
      setFormData({
        title: '',
        author: '',
        image_url: ''
      });
      setPopupMessage('Book added successfully!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      onBookAdded();
    } catch (error) {
      console.error('Error adding book:', error);
      setPopupMessage('Error adding book. Please try again.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-32 right-8 p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-50"
      >
        <img src={iconInsert} alt="Add Book" className="w-8 h-8" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-96 border border-white/20 transform transition-all duration-300 animate-modal-in hover:shadow-purple-500/10 hover:border-white/30">
            <h2 className="text-3xl font-bold mb-6 text-white">Add New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-white/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300"
                  placeholder="Enter book title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-white/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300"
                  placeholder="Enter author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-white/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 bg-white/5 backdrop-blur-sm text-white placeholder-white/50 transition-all duration-300"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-sm font-medium text-white/90 bg-white/10 rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-purple-500/20"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-4 max-w-sm animate-fade-in z-50">
          <p className={`text-sm ${popupMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {popupMessage}
          </p>
        </div>
      )}
    </>
  );
};

export default InsertBookForm;