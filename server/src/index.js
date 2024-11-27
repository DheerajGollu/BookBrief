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

    //const schema = '{ title:"title", authors:"authors", summary:"summary", similarity_list:[ {title:"title", decription:"description"} ] }'
    //const prompt = "Provide a short summary of '" + title + "' by the authors: " + author + " and a list of 5 similar books in the following schema: " + schema;
    //   const prompt = "Provide a good summary of '" + title + "' book by this " + author + " and provide a list of 5 similar books.";
    const prompt = 
        `Provide a good summary of "` + title + `" by ` + author + ` and a list of 5 similar books using this JSON schema: 

            {"summary": string, similarBooks: Array<{"title": string, "description": string}>}
        `;
    
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.substring(8, text.length - 4);
    return text;
}


app.get('/', (req, res) => { 
    res.send('congrats you have reached the server!'); 
});


app.post('/summarizeBook', async (req, res) => { 
    const { title, author } = req.body;
    console.log('Received book data:', {title, author});
    try {
        let summary = await generateSummary(title, author);
        summary = JSON.parse(summary);
        console.log(summary.similarBooks);
        res.status(200).json({ title, author, summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).send('Error generating summary');
    }
});


app.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
})