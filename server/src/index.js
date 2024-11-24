const express = require('express'); //import express
const app = express(); //create an express app
const cors = require('cors'); //to get requests from front end

const corsOptions = { //5173 is local host where vite is running
    origin: ['http://localhost:5173'],
}

app.use(express.json()); // just use json for testing rn

app.use(cors(corsOptions));

app.get('/', (req, res) => { 
    res.send('Its coding time baby!'); 
});

app.post('/book', (req, res) => { 
    const {  title, author } = req.body;
    // console.log(`Received book name: ${ searchQuery}`);
    console.log('Received book data:', title, author);
    res.send(`Received book data: ${title}, ${author}`); // send back a response for front end
});


app.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
})