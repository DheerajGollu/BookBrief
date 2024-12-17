import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; 

dotenv.config();
const app = express(); // Create an express app
app.use(express.json()); // Middleware to parse JSON request bodies

const corsOptions = { 
    origin: ['http://localhost:5173'],
}
app.use(cors(corsOptions)); // Enable CORS to allow requests from the client-side 

const genAI = new GoogleGenerativeAI("AIzaSyBKVJXJ111S-ZVWGx0dDYEz7mCvJfWqdLg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//this function will generate a summary of a book and a list of 5 similar books
const generateSummary = async (title, author) => {
    const prompt = 
        `Provide a good summary of "` + title + `" by ` + author + ` and a list of 5 similar books using this JSON schema: 

            {"summary": string, similarBooks: Array<{"title": string, "description": string}>}
        `;
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.substring(8, text.length - 4);
    return text;
}

app.get('/', (req, res) => { //default route
    res.send('congrats you have reached the server!'); 
});

//this is the endpoint that will handle user requests to summarize a book
app.post('/summarizeBook', async (req, res) => { 
    const { title, author } = req.body;
    console.log('Received book data:', {title, author});
    try {
        let summary = await generateSummary(title, author);
        summary = JSON.parse(summary);
        console.log('Generated summary:', summary.summary);
        res.status(200).json({ title, author, summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).send('Error generating summary');
    }
});


app.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
})