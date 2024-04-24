import React, { useState, useEffect } from 'react';
import api from '../api';
import './BookList.css';
import { Link } from 'react-router-dom'; // Importing Link for routing

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

    // Fetching the list of books
    useEffect(() => {
        api.get('/api/books/')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    // Filtering books based on the search term and filter options
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
        setShowModal(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBook(null);
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
                            <Link to="/admin" className="nav-links">
                                Admin
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
                    {getUniqueGenres(books).map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                    ))}
                </select>

                <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="filter-select">
                    <option value="">All Authors</option>
                    {getUniqueAuthors(books).map(author => (
                        <option key={author} value={author}>{author}</option>
                    ))}
                </select>

                <select value={historicalPeriodFilter} onChange={(e) => setHistoricalPeriodFilter(e.target.value)} className="filter-select">
                    <option value="">All Historical Periods</option>
                    {getUniqueHistoricalPeriods(books).map(period => (
                        <option key={period} value={period}>{period}</option>
                    ))}
                </select>
            </div>
            <ul className="book-list">
                {filteredBooks.map(book => (
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
                        <img src={selectedBook.image} alt={selectedBook.title} className="book-modal-image" />
                        <div className="book-modal-info">
                            <h2>{selectedBook.title}</h2>
                            <p><strong>Author:</strong> {selectedBook.author}</p>
                            <p><strong>Genre:</strong> {selectedBook.genre}</p>
                            <p><strong>Historical Period:</strong> {selectedBook.historical_period}</p>
                            <p><strong>Location:</strong> {selectedBook.location}</p>
                            <p><strong>Description:</strong> {selectedBook.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookList;
