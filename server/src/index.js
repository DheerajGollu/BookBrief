import express from 'express'; 
import cors from 'cors'; 
import dotenv from 'dotenv'; 
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import GoogleGenerativeAI

dotenv.config();
const app = express(); // Create an express app
const corsOptions = { 
    origin: ['http://localhost:5173'],
}
const genAI = new GoogleGenerativeAI("AIzaSyBKVJXJ111S-ZVWGx0dDYEz7mCvJfWqdLg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateSummary = async (title) => {
    const prompt = "Provide a short summary of '" + title + "' book and provide a list of 5 similar book titles only without any explanation.";
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    return text;
}

app.use(express.json()); // Middleware to parse JSON request bodies

app.use(cors(corsOptions));

app.get('/', (req, res) => { 
    res.send('Its coding time baby!'); 
});

app.post('/book', (req, res) => { 
    const { title, author } = req.body;
    console.log('Received book data:', {title, author});
    generateSummary(title).then(summary => {
        console.log(summary); // log the summary after promise resolved
    }).catch(error => {
        console.error('Error generating summary:', error);
    });
    res.status(200).send('here is the book data: ' + title + ' by ' + author);
});


app.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
})