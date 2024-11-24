import express from 'express'; // Import express
import cors from 'cors'; // Import cors
import dotenv from 'dotenv'; // Import dotenv
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import GoogleGenerativeAI

dotenv.config();
const app = express(); // Create an express app
const corsOptions = { 
    origin: ['http://localhost:5173'],
}
const genAI = new GoogleGenerativeAI("AIzaSyBKVJXJ111S-ZVWGx0dDYEz7mCvJfWqdLg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = "Provide a short summary of '" + {bookname} + "' book and provide a list of 5 similar books.";

// const result = await model.generateContent(prompt);
// console.log(result.response.text());

app.use(express.json()); // Middleware to parse JSON request bodies

app.use(cors(corsOptions));

app.get('/', (req, res) => { 
    res.send('Its coding time baby!'); 
});

app.post('/book', (req, res) => { 
    const { title, author } = req.body;
    // const prompt = `Provide a short summary of '${title}' book and by ${author}, and also provide a list of 5 similar books.`;
    // const result = model.generateContent(prompt);
    console.log('Received book data:', {title, author});
    // res.send(result.response.text()); // send back a response for front end
    res.status(200).send('here is the book data: ' + title + ' by ' + author);
});


app.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
})