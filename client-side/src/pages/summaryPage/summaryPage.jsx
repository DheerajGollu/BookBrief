import './summaryPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

const SummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); //this contains info bout current URL (state, pathname)
    const { title, author, bookImage } = location.state; //destructure the info
    const [summary, setSummary] = useState(<Spinner variant="success" animation="border" />);
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
               setSummary(''); 
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
                setCurrentIndex(prevIndex => prevIndex + 1); // Use functional update
            }, 35);
    
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
        setSummary(<Spinner variant="success" animation="border" />);
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
                <div className="book-info whiteText">
                    <strong>{book.volumeInfo.title}</strong>
                </div>
            </div>
        );
    };

    const handleHomepageClick = () => {
        navigate('/');
    }
      
    return (
        <div className="summaryPageContainer">
            <div className='headerContainer' onClick={handleHomepageClick}>
              <p className='mainHeader'> Book Brief</p> 
              <p className='subHeader'>Summary</p> 
            </div>

            <div className='bookInfoContainer'>
                <div className='bookCoverContainer'>
                    <img className="bookCover" src={bookImage} alt={`${title} cover`}/>
                </div>
                <div className='bookSummaryContainer'>
                    <div className='bookTitle'>
                        <p className='normalText'> <span className="bookTitleText"> Title:</span> {title}</p>
                    </div>
                    <div className='bookAuthor'>
                    <p className='normalText'> <span className="bookTitleText"> Author:</span> {author}</p>
                    </div>
                    <hr style={{ width: '100%', height: '1px', color: 'white' }} />
                    <div className='bookSummary'>
                        <p className='normalText'>{summary}</p>
                    </div>
                </div>
            </div>

            <div className='similarBooksContainer'>
                <div className='similarBooksHeader'>
                    <p className='similarBookText'>Similar Books</p>
                </div>
                <div className='horizontalScroll'>
                    {books.length === 0 ? (
                          loading ?  <Spinner variant="success" animation="border" /> 
                          :  <Spinner variant="success" animation="border" />
                    ) : (
                        books.map(renderBook)
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;

