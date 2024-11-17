// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/app.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/homePage'
function App() {
    return(
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} /> 
      {/* <Route path="/summary" element={<SummaryPage />} />  */}
    </Routes>
    </Router>
    );
}

export default App;
