const express = require('express'); //import express
const app = express(); //create an express app
const cors = require('cors'); //to get requests from front end

const corsOptions = { //5173 is local host where vite is running
    origin: ['http://localhost:5173'],
}

app.use(cors(corsOptions));
app.get('/', (req, res) => { 
    res.send('Its coding time baby!');
});

app.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
})