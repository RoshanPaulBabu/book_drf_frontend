import React, { useState, useEffect } from 'react';
import api from '../api';
import './BookList.css';
import { Link } from 'react-router-dom';

const getUniqueGenres = (books) => {
    const genres = books.map(book => book.genre);
    return [...new Set(genres)];
};

const getUniqueAuthors = (books) => {
    const authors = books.map(book => book.author);
    return [...new Set(authors)];
};

const getUniqueHistoricalPeriods = (books) => {
    const historicalPeriods = books.map(book => book.historical_period);
    return [...new Set(historicalPeriods)];
};

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
    const [historicalPeriodFilter, setHistoricalPeriodFilter] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // States for editing book details
    const [editTitle, setEditTitle] = useState('');
    const [editAuthor, setEditAuthor] = useState('');
    const [editGenre, setEditGenre] = useState('');
    const [editHistoricalPeriod, setEditHistoricalPeriod] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);


    // Fetching the list of booksggggggggg
    useEffect(() => {
        api.get('/api/books/')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    // Filtering books based on the search term and filter optionsgggg
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.historical_period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.location.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(book => 
        (genreFilter === '' || book.genre === genreFilter) &&
        (authorFilter === '' || book.author === authorFilter) &&
        (historicalPeriodFilter === '' || book.historical_period === historicalPeriodFilter)
    );

    // Handle book card click
    const handleBookClick = (book) => {
        setSelectedBook(book);
        // Populate the edit form with the selected book's details
        setEditTitle(book.title);
        setEditAuthor(book.author);
        setEditGenre(book.genre);
        setEditHistoricalPeriod(book.historical_period);
        setEditLocation(book.location);
        setEditDescription(book.description);
        setShowModal(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBook(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };
    

    // Handle editing book details
    const handleEditBook = async (event) => {
        event.preventDefault();
    
        // Create a FormData object to send the form data
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('author', editAuthor);
        formData.append('genre', editGenre);
        formData.append('historical_period', editHistoricalPeriod);
        formData.append('location', editLocation);
        formData.append('description', editDescription);
    
        // If a new image was selected, append it to the FormData object
        if (selectedImage) {
            formData.append('image', selectedImage);
        }
    
        try {
            await api.put(`/api/books/${selectedBook.id}/`, formData);
            // Refresh the list of books after editing
            const response = await api.get('/api/books/');
            setBooks(response.data);
            handleCloseModal(); // Close the modal
        } catch (error) {
            console.error('Error editing book:', error);
        }
    };
    

    
    // Handle book deletion
    const handleDeleteBook = async () => {
        if (!selectedBook) {
            return;
        }

        try {
            await api.delete(`/api/books/${selectedBook.id}/`);
            // Remove the deleted book from the state
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== selectedBook.id));
            handleCloseModal(); // Close the modal
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };  

    // Define Navbar as a separate function
    function Navbar() {
        return (
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        Book Mashup
                    </Link>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/logout" className="nav-links">
                                Logout
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/add" className="nav-links">
                                Add Book
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-links">
                                Home
                            </Link>
                        </li>
                        {/* Add more navigation items as needed */}
                    </ul>
                </div>
            </nav>
        );
    }

    return (
        <div className="book-list-container">
            <Navbar />
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="filter-container">
                <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="filter-select">
                    <option value="">All Genres</option>
                    {getUniqueGenres(books).map((genre) => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>

                <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="filter-select">
                    <option value="">All Authors</option>
                    {getUniqueAuthors(books).map((author) => (
                        <option key={author} value={author}>{author}</option>
                    ))}
                </select>

                <select value={historicalPeriodFilter} onChange={(e) => setHistoricalPeriodFilter(e.target.value)} className="filter-select">
                    <option value="">All Historical Periods</option>
                    {getUniqueHistoricalPeriods(books).map((period) => (
                        <option key={period} value={period}>{period}</option>
                    ))}
                </select>
            </div>
            <div className="add-book-container">
                <Link to="/add" className="add-book-button">
                    Add Book
                </Link>
            </div>
            <ul className="book-list">
                {filteredBooks.map((book) => (
                    <li key={book.id} className="book-item" onClick={() => handleBookClick(book)}>
                        <img src={book.image} alt={book.title} className="book-image" />
                        <div className="book-info">
                            <h3 className="book-title">{book.title}</h3>
                            <p className="book-author">by {book.author}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {showModal && selectedBook && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Edit Book Details</h2>
                        <form onSubmit={handleEditBook}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Author</label>
                                <input
                                    type="text"
                                    value={editAuthor}
                                    onChange={(e) => setEditAuthor(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Genre</label>
                                <input
                                    type="text"
                                    value={editGenre}
                                    onChange={(e) => setEditGenre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Historical Period</label>
                                <input
                                    type="text"
                                    value={editHistoricalPeriod}
                                    onChange={(e) => setEditHistoricalPeriod(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={editLocation}
                                    onChange={(e) => setEditLocation(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
        <label>Image</label>
        <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
        />
    </div>                            
                            <div className="modal-actions">
                                <button type="submit" className="save-button">Save Changes</button>
                                <button type="button" className="delete-button" onClick={handleDeleteBook}>Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookList;
