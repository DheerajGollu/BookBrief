import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/app.css';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchBooks(searchQuery);
        }, 500); // Debounce API call by 500ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);
  const [bookName, setBookName] = useState('');
  const handleInput = (event) =>{
    setBookName(event.target.value);
  } //handle input change so value can match
  const fetchData = async () => {
    try {
      // Send a POST request with bookName in the request body
      const response = await axios.post('http://localhost:8080/book', { bookName });
      console.log(response.data); // Log data for testing purposes
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } 

  return (
    <div className='app'>
    <h1>Welcome to Book Brief!</h1>

    <input type="text" 
    name = "bookName"
    value = {bookName}
    onChange = {handleInput}
    placeholder='Enter book title...'
    />
     {/* When the button is clicked, it calls fetchData to send bookName */}
     <button onClick={fetchData}>Submit</button> 
    
    <p>{bookName}</p>
     </div>
  );
}

export default App;
