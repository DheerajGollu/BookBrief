import './summaryPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const SummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); //this contains info bout current URL (state, pathname)
    const [summary, setSummary] = useState('Generating summary...');
    const { title, author, bookImage } = location.state; //destructure the info
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchSummary = async () => { //this is to fetch the summary of the book
            try {
                const response = await axios.post('/summarizeBook', { title, author });
                setWords(response.data.summary.split(' '));
                setCurrentIndex(0);
                setSummary('');
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

    return (
        <div className="SummaryPageContainer">
            <h1>Summary Page:</h1>
            <h2>Here are the information for that book:</h2>
            <img src={bookImage} alt={`${title} cover`}/>
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Author:</strong> {author}</p>
            <p><strong>Summary:</strong> {summary}</p>
            <br />
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default SummaryPage;



