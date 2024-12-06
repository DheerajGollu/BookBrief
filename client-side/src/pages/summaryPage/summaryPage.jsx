import './summaryPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const SummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); //this contains info bout current URL (state, pathname)
    const { title, author, bookImage } = location.state; //destructure the info
    const [summary, setSummary] = useState('Generating summary...');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

    
    useEffect(() => {
        const fetchBookData = async (query) => {
            try {
                try {
                    const response = await axios.get(`${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=1`);
                    return response.data.items[0]; 
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            } catch (error) {
                setSummary('Error generating summary');
                console.error('Error generating summary:', error);
            }
        };

        const fetchSummary = async () => {
            try {
                const response = await axios.post('/summarizeBook', { title, author });
               setWords(response.data.summary.summary.split(' '));
               setCurrentIndex(0);
               setSummary(''); // Clear the summary
               setLoading(false);
                let list = response.data.summary.similarBooks;
                let books_list = []
                books_list = await Promise.all(
                    list.map(async (item) => {
                      let info = await fetchBookData(item.title);
                      return info; // Return each resolved info
                    })
                );
                console.log("book_list: " + JSON.stringify(books_list));
                setBooks(books_list);

            } catch (error) {
                setSummary('Error generating summary');
                console.error('Error generating summary:', error);
            }
        };

        fetchSummary();
    }, [title, author]);

    useEffect(() => { //this is to display the summary word by word 
        if (words.length > 0 && currentIndex < words.length) {
            const intervalId = setInterval(() => {
                setSummary(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
                setCurrentIndex(currentIndex + 1);
            }, 50);
    
            return () => clearInterval(intervalId);
        }
    }, [words, currentIndex]);

    const handleBookClick = (book) => {
        const bookData = {
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
            bookImage: book.volumeInfo.imageLinks?.thumbnail || 'No Image Available'
        };
        setLoading(true);
        setBooks([]);
        setSummary('Generating summary...');
        navigate('/summary', { state: bookData });
    };

    const renderBook = (book) => {
        return(
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
    };
      
    return (
        <div className="summaryPageContainer">
            <div className='headerContainer'>
              <p className='mainHeader'> Book Brief</p> 
              <p className='subHeader'>Summary</p> 
            </div>
            
            <div>

                <p> <span className="title">Title</span> powershift </p>
            </div>
            
        </div>
    );
};

export default SummaryPage;


{/* <h1>Summary Page:</h1>
            <h2>Here are the information for that book:</h2>
            <img src={bookImage} alt={`${title} cover`} className="sumImg"/>
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Author:</strong> {author}</p>
            <p><strong>Summary:</strong> {summary}</p>
            <button onClick={() => navigate('/')}>Back to Home</button>

            <div>
                <h1>5 Similar Books:</h1>

                <div className="horizontal_scroll">
                    {books.length === 0 ? (
                          loading ? <p>Loading Books...</p> : <p>Loading Books...</p>
                    ) : (
                        books.map(renderBook)
                    )}
                </div>
            </div> */}