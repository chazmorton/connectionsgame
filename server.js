const express = require('express');
const axios = require('axios');

const getGameDayData = require('./src/api/getDayGame');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('src'));

// Serve your HTML file
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/src/game.html');
});

// Endpoint to fetch data from New York Times API
app.get('/api/getDayGame', async (req, res) => {
    try {
        const gameData = await getGameDayData();
        console.log("Game data", gameData);
        res.json(gameData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
