import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../styles/Forms.css';

const AddBook = ({ onBookAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        historical_period: '',
        location: '',
        description: '',
        image: null,
    });

    // Obtain the navigate function
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            form.append(key, formData[key]);
        });

        try {
            await api.post('/api/books/', form);
            // Notify parent component of the new book
            onBookAdded();
        } catch (error) {
            console.error('Error adding book:', error);
        } finally {
            // Redirect to the home page after submission, regardless of success or failure
            navigate('/admin');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="book-form">
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={formData.genre}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="historical_period"
                placeholder="Historical Period"
                value={formData.historical_period}
                onChange={handleChange}
            />
            <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
            />
            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
            />
            <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
            />
            <button type="submit">Add Book</button>
        </form>
    );
};

export default AddBook;
