const dateArray = getDateArray();

function getDateArray() {
    const dateArray = [];

    let startDate = new Date('2023-06-12');
    startDate.setHours(startDate.getHours() + 6);

    const endDate = new Date();

    while (startDate <= endDate) {
        const year = startDate.getFullYear();
        const month = String(startDate.getMonth() + 1).padStart(2, '0');
        const date = String(startDate.getDate()).padStart(2, '0');
        dateArray.push(`${year}-${month}-${date}`);
        startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
}

function getRandomDateFromDateArray() {
    const randomIndex = Math.floor(Math.random() * dateArray.length);
    return dateArray[randomIndex];
}

async function getGameDayData() {
    try {

        const randomDate = getRandomDateFromDateArray();
        // const randomDate = "2024-05-12";

        console.log(`Fetching game of date ${randomDate}.`);

        const axios = require('axios');

        const response = await axios.get(`https://www.nytimes.com/svc/connections/v2/${randomDate}.json`);

        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function retryGameDayData(retryDate) {
    try {
        const axios = require('axios');

        const response = await axios.get(`https://www.nytimes.com/svc/connections/v2/${retryDate}.json`);

        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

module.exports = {
    getGameDayData,
    retryGameDayData
};