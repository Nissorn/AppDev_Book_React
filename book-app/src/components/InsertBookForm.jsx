import { useState } from 'react';
import axios from 'axios';

const InsertBookForm = ({ onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    image_url: ''
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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
    <div className="backdrop-blur-md bg-white/30 rounded-xl shadow-xl p-6 border border-white/20 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter book title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter image URL"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-md hover:opacity-90 transition-opacity duration-200"
        >
          Add Book
        </button>
      </form>

      {showPopup && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm animate-fade-in">
          <p className={`text-sm ${popupMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {popupMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default InsertBookForm;