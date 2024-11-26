import './summaryPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

const SummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); //this contains info bout current URL (state, pathname)
    const { title, author, summary, bookImage } = location.state; //destructure the info

    return (
        <div className="SummaryPageContainer">
            <h1>Summary Page:</h1>
            <h2>Here are the information for that book:</h2>
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Author:</strong> {author}</p>
            <p><strong>Summary:</strong> {summary}</p>
            <img src={bookImage} alt={`${title} cover`}/>
            <br />
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default SummaryPage;