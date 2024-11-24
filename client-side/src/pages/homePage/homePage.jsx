import { useEffect, useState } from 'react';
import axios from 'axios';
import './homePage.css';

const HomePage = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [discoveryQueue, setDiscoveryQueue] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch search results based on query
    const fetchBooks = async (query) => {
        if (!query) {
            setBooks([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
            setBooks(response.data.docs.slice(0, 10)); // Limit results to the first 10 books
        } catch (error) {
            console.error("Error fetching data:", error);
            setBooks([]);
        }
        setLoading(false);
    };

    // Fetch discovery queue for initial book suggestions
    const fetchDiscoveryQueue = async () => {
        try {
            const response = await axios.get('https://openlibrary.org/subjects/fiction.json?limit=10');
            setDiscoveryQueue(response.data.works);
        } catch (error) {
            console.error("Error fetching discovery queue:", error);
        }
    };

    useEffect(() => {
        fetchDiscoveryQueue(); // Fetch discovery queue on component mount
    }, []);

    const handleInput = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchBooks(searchQuery); // Trigger search when Enter is pressed
        }
    };

    const handleBookClick = async (book) => {
        const bookData = {
            title: book.title,
            author: book.authors ? book.authors.map(author => author.name).join(', ') : 'Unknown Author',
        };
        try {
          const response = await axios.post('/book', bookData);
          console.log('Book data sent successfully!', response.data);
        } catch (error) {
            console.error('Error sending book data:', error);
        }
    };

    return (
        <div className='app'>
            <h1>Welcome to Book Brief!</h1>
            <input
                type="text"
                placeholder="Search for a book..."
                value={searchQuery}
                onChange={handleInput}
                onKeyDown={handleKeyDown} // Add event listener for Enter key
            />
            {loading && <p>Loading...</p>}
            <ul>
                {books.map((book) => (
                    <li key={book.key}>
                        <strong>{book.title}</strong> by {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
                    </li>
                ))}
            </ul>

            <h2>Discovery Queue</h2>
            <div className="discovery-queue">
                {discoveryQueue.map((book) => (
                    <div key={book.key} className="discovery-book" onClick={() => handleBookClick(book)}>
                        {book.cover_id ? (
                            <img
                                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                                alt={`${book.title} cover`}
                                className="book-cover"
                            />
                        ) : (
                            <div className="no-cover">No Cover Available</div>
                        )}
                        <div className="book-info">
                            <strong>{book.title}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
