const express = require('express');
const axios = require('axios');

const { getGameDayData, retryGameDayData } = require('./src/api/getGameDayData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(`public`));
app.use(express.static(`src`));

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

app.get('/api/retryDayGame', async (req, res) => {
    try {
        const currGameDate = req.query.currentGameDate;

        console.log("Getting curr Game Date! ", currGameDate);

        const gameData = await retryGameDayData(currGameDate);
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
