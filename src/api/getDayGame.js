async function getGameDayData() {
    try {
        console.log("Hitting function.");

        const axios = require('axios');

        const response = await axios.get('https://www.nytimes.com/svc/connections/v2/2024-05-05.json');

        console.log(response.data);
        // console.log(response.data.categories[0]);

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

module.exports = getGameDayData;