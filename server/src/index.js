import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import GoogleGenerativeAI

dotenv.config();
const app = express(); // Create an express app
app.use(express.json()); // Middleware to parse JSON request bodies

const corsOptions = { 
    origin: ['http://localhost:5173'],
}
app.use(cors(corsOptions));// Enable CORS to allow requests from the client-side app

const genAI = new GoogleGenerativeAI("AIzaSyBKVJXJ111S-ZVWGx0dDYEz7mCvJfWqdLg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateSummary = async (title, author) => {
    const prompt = "Provide a good summary of '" + title + "' book by this " + author + " and provide a list of 5 similar books.";
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    return text;
}


app.get('/', (req, res) => { 
    res.send('congrats you have reached the server!'); 
});


app.post('/book', async (req, res) => { 
    const { title, author } = req.body;
    console.log('Received book data:', {title, author});
    try {
        const summary = await generateSummary(title, author);
        console.log(summary); 
        res.status(200).json({ title, author, summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).send('Error generating summary');
    }
});


app.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
})