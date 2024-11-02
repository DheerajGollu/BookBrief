import { useEffect } from 'react'
import axios from 'axios' //to send requests to server
import '../styles/app.css'
function App() {
  const fetchData = async () => {
    const response = await axios.get('http://localhost:8080/'); //fetch data from server
    console.log(response.data); //log data for testing purpose
  }
  useEffect(() => { 
    fetchData();  
  }, []); //run only once

  return (
    <div className='app'>
    <h1>Welcome to Book Brief!</h1>
    <input type="text" />
     </div>
  )
}

export default App
