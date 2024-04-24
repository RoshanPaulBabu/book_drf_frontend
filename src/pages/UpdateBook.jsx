import React, { useState, useEffect } from 'react';
import api from '../api';

function UpdateBook({ match }) {
    const [book, setBook] = useState({});

    useEffect(() => {
        api.get(`/books/${match.params.id}`)
            .then(res => setBook(res.data))
            .catch(err => console.error(err));
    }, [match.params.id]);

    const handleChange = e => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        api.put(`/books/update/${match.params.id}`, book)
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" name="title" value={book.title} onChange={handleChange} />
            </label>
            {/* Add other fields as necessary */}
            <button type="submit">Update</button>
        </form>
    );
}

export default UpdateBook;
