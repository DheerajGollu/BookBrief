import './summaryPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const SummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); //this contains info bout current URL (state, pathname)
    const [summary, setSummary] = useState('Generating summary...');
    const [similarList, setSimilarList] = useState([]);
    const [books, setBooks] = useState([]);
    //const [loading, setLoading] = useState(false);
    const { title, author, bookImage } = location.state; //destructure the info

    const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

    

    useEffect(() => {

        const fetchBookData = async (query) => {
            try {
    
                try {
                    const response = await axios.get(`${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=1`);
                    //setBooks(response.data.items || []); // Set results
                    //console.log(JSON.stringify(response.data.items[0]));
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
                
                setSummary(response.data.summary.summary);
                let list = response.data.summary.similarBooks;
                
                let books_list = []

                books_list = await Promise.all(
                    list.map(async (item) => {
                      let info = await fetchBookData(item.title);
                      return info; // Return each resolved info
                    })
                );
                
                setSimilarList(list);
                //console.log("list: " + JSON.stringify(list));
                console.log("book_list: " + JSON.stringify(books_list));
                setBooks(books_list);
                console.log("books: " + JSON.stringify(books));

            } catch (error) {
                setSummary('Error generating summary');
                console.error('Error generating summary:', error);
            }
            
        };

        fetchSummary();
    }, [title, author]);

    const renderBook = (book) => (

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
        <>
            <div className="SummaryPageContainer">
                <h1>Summary Page:</h1>
                <h2>Here are the information for that book:</h2>
                <img src={bookImage} alt={`${title} cover`}/>
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Author:</strong> {author}</p>
                <p><strong>Summary:</strong> {summary}</p>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>

            
            <div>
                <h1>5 Similar Books:</h1>
                <div className="horizontal_scroll">
                    {books.length === 0 ? (
                        <p>Loading Books...</p>
                    ) : (
                        books.map(renderBook)
                    )}
                </div>
            </div>
        </>
    );
};

export default SummaryPage;
