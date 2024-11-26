import './summaryPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const SummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); //this contains info bout current URL (state, pathname)
    const [summary, setSummary] = useState('Generating summary...');
    const { title, author, bookImage } = location.state; //destructure the info

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axios.post('/summarizeBook', { title, author });
                const words = response.data.summary.split(' ');
                let currentWordIndex = 0;
                setSummary(''); // Clear the initial "Generating summary..." text

                const intervalId = setInterval(() => {
                    if (currentWordIndex < words.length) {
                        setSummary(prev => prev + (currentWordIndex > 0 ? ' ' : '') + words[currentWordIndex]);
                        currentWordIndex++;
                    } else {
                        clearInterval(intervalId);
                    }
                }, 50); // add new word every 50ms

            } catch (error) {
                setSummary('Error generating summary');
                console.error('Error generating summary:', error);
            }
        };

        fetchSummary();
    }, [title, author]);

    return (
        <div className="SummaryPageContainer">
            <h1>Summary Page:</h1>
            <h2>Here are the information for that book:</h2>
            <img src={bookImage} alt={`${title} cover`}/>
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Author:</strong> {author}</p>
            <p><strong>Summary:</strong> {summary}</p>
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default SummaryPage;



