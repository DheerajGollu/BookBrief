import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/homePage'
import SummaryPage from './pages/summaryPage/summaryPage'
function App() {
    return(
    <Router>
    <Routes>
      <Route path="/" element={<HomePage />} /> 
      <Route path="/summary" element={<SummaryPage />} /> 
    </Routes>
    </Router>
    );
}

export default App;
