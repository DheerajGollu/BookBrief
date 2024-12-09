import { useEffect, useState } from 'react';
import axios from 'axios';
import './homePage.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faShuffle } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';

const HomePage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]); // For displaying search results
    const [discoveryQueue, setDiscoveryQueue] = useState([]); // Discovery queue with random books
    const [loading, setLoading] = useState(false);

    const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

    const fetchSearchResults = async (query) => {// fetch search results based on the query
        if (!query || query.trim() === '') {// clear search results if query is empty or only contains white spaces
            setSearchResults([]); 
            return;
        }
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharPattern.test(query)) {
        setSearchResults([]);
        alert("Search query contains special characters!!!");
        console.error("Error: Search query contains special characters.");
        return;
    }
        setLoading(true);
        try {
            const response = await axios.get(`${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=10`);
            setSearchResults(response.data.items || []); // Set search results
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDiscoveryQueue = async () => { // Fetch discovery queue with random books
        try {
            const response = await axios.get(`${GOOGLE_BOOKS_API_BASE_URL}?q=subject:fiction&maxResults=10`);
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

            <div className="header">
                <h1 className="title">Book Brief</h1>
            </div>

            <div className="search-area">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown} 
                    />
                    <button className="iconBtn" onClick={() => fetchSearchResults(searchQuery)}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" size="2x" />
                    </button>
                </div>
            </div>

            { searchResults.length != 0 ?
                (<div className="container">
                    <div className='inner-container'>
                        <div className='header-container'>
                            <p className='header-text'> Search Results </p>
                        </div>
                        <div className="books-container">
                            {searchResults.length === 0 ? (
                                loading ?  <Spinner variant="success" animation="border" /> 
                                :  <p>Try Searching For A Book</p>
                            ) : (
                                searchResults.map(renderBookCard)
                            )}
                        </div>
                    </div>
                </div>) : (<></>) 
            }
            
            <br></br>
            
            <div className="container">
                <div className='inner-container'>
                    <div className='header-container'>
                        <p className='header-text'>
                            Discovery Queue
            
                            <button className="iconBtn" onClick={fetchDiscoveryQueue}> 
                                <FontAwesomeIcon className="icon" icon={faShuffle} />
                            </button>
                        </p>
                    </div>
                    <div className='books-container'>
                        {discoveryQueue.map(renderBookCard)}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
