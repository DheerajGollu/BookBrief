import { useEffect, useState } from 'react';
import axios from 'axios';
import './homePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]); // For displaying search results
    const [discoveryQueue, setDiscoveryQueue] = useState([]); // Discovery queue with random books
    const [loading, setLoading] = useState(false);

    const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

    // Fetch search results based on the query
    const fetchSearchResults = async (query) => {
        if (!query) {
            setSearchResults([]); // Clear search results if query is empty
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=20`);
            setSearchResults(response.data.items || []); // Set search results
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch discovery queue with random books
    const fetchDiscoveryQueue = async () => {
        try {
            const response = await axios.get(`${GOOGLE_BOOKS_API_BASE_URL}?q=subject:fiction&maxResults=40`);
            const shuffledBooks = response.data.items?.sort(() => 0.5 - Math.random()) || []; // Shuffle books
            setDiscoveryQueue(shuffledBooks.slice(0, 10)); // Pick the first 10 random books
        } catch (error) {
            console.error("Error fetching discovery queue:", error);
        }
    };

    // Fetch discovery queue on component mount
    useEffect(() => {
        fetchDiscoveryQueue();
    }, []);

    const handleInput = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchSearchResults(searchQuery); // Fetch search results when Enter is pressed
        }
    };

    const handleBookClick = (book) => {
        const bookData = {
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
            bookImage: book.volumeInfo.imageLinks?.thumbnail || 'No Image Available'
        };
        navigate('/summary', { state: bookData });
    };

    const renderBookCard = (book) => (
        <div key={book.id} className="book-card" onClick={() => handleBookClick(book)}>
            {book.volumeInfo.imageLinks?.thumbnail ? (
                <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={`${book.volumeInfo.title} cover`}
                    className="book-cover"
                />
            ) : (
                <div className="no-cover">No Cover Available</div>
            )}
            <div className="book-info">
                <strong>{book.volumeInfo.title}</strong>
                <p>{book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}</p>
            </div>
        </div>
    );

    return (
        <div className="app">
            <h1>Welcome to Book Brief!</h1>

            <input
                type="text"
                placeholder="Search for a book..."
                value={searchQuery}
                onChange={handleInput}
                onKeyDown={handleKeyDown} 
            />

            {loading && <p>Loading...</p>}

            <h2>Search Results:</h2>
            <div className="horizontal-scroll">
                {searchResults.length === 0 && !loading ? (
                    <p>No search results yet. Try searching for a book!</p>
                ) : (
                    searchResults.map(renderBookCard)
                )}
            </div>

            <h2>Discovery Queue</h2>
            <button onClick={fetchDiscoveryQueue}> Shuffle </button>
            <div className="discovery-queue">
                {discoveryQueue.map(renderBookCard)}
            </div>
        </div>
    );
};

export default HomePage;
