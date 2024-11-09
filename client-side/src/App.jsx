import {  useState } from 'react'
import axios from 'axios' //to send requests to server
import '../styles/app.css'
function App() {
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

export default App
