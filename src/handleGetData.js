var selectedArr = [];
var solutionsObj = {};
var guesses = 4;
var shuffledWords = [];
var correctCount = 0;

var currentGameDate = "";

var dateArray = [];

window.onload = function() {
    handleGetData();
};

function handleGetData() {
    fetch('/api/getDayGame')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            guesses = 4;
            selectedArr = [];
            correctCount = 0;
            currentGameDate = data.print_date;
            dateArray = getDateArray();
            populateSelectorDates();
            setSelectorCurrDate();
            var correctModal = document.getElementById("correctModal");
            closeModal(correctModal);
            var failedModal = document.getElementById("failedModal");
            closeModal(failedModal);
            const correctCategoryContainer = document.querySelector('.correctCategoryContainer');
            correctCategoryContainer.innerHTML = '';
            populateGrid(data);
            solutions(data);
            populateGuesses(guesses)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function retryGame() {
    fetch(`/api/retryDayGame?currentGameDate=${currentGameDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            guesses = 4;
            selectedArr = [];
            correctCount = 0;
            currentGameDate = data.print_date;
            dateArray = getDateArray();
            populateSelectorDates();
            setSelectorCurrDate();
            var correctModal = document.getElementById("correctModal");
            closeModal(correctModal);
            var failedModal = document.getElementById("failedModal");
            closeModal(failedModal);
            const correctCategoryContainer = document.querySelector('.correctCategoryContainer');
            correctCategoryContainer.innerHTML = '';
            populateGrid(data);
            solutions(data);
            populateGuesses(guesses)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function shuffle() { 
    for (let i = shuffledWords.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]]; 
    } 
    return shuffledWords; 
}; 

function shuffle2(array) {
    for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array;
}

function shuffleGrid() {
    const gameGrid = document.querySelector(".gameGrid");
    const gridItems = Array.from(gameGrid.querySelectorAll('.gameGridItem'));
  
    // Shuffle the array of grid items

    const shuffledGridItems = shuffle2(gridItems);
  
    // Clear the grid
    gameGrid.innerHTML = '';
  
    // Reinsert shuffled grid items into the grid
    shuffledGridItems.forEach(item => {
      gameGrid.appendChild(item);
    });
}

function populateGrid(data) {

    const gameGrid = document.querySelector('.gameGrid');
    gameGrid.innerHTML = ''; 
    shuffledWords = []

    console.log(data.categories);
    data.categories.forEach(category => {
        category.cards.forEach(word => {
            shuffledWords.push(word.content);
        })
    });

    shuffle();

    shuffledWords.forEach(word => {
        const gridItem = document.createElement('button');
        gridItem.classList.add('gameGridItem');
        gridItem.textContent = `${word}`;
        gridItem.addEventListener('click', function() {
            console.log("Button clickied!");
            if(selectedArr.includes(word)) {
                gridItem.classList.toggle('selected');
                selectedArr = removeFromArrayIfExists(selectedArr, word);
            }
            else {
                if(selectedArr.length < 4) {
                    gridItem.classList.toggle('selected');
                    selectedArr.push(word);
                }
            }
            console.log(selectedArr);
        });
        gameGrid.appendChild(gridItem);
    })
}

function removeFromArrayIfExists(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array;
}

function solutions(data) {
    console.log("!! ", data);
    solutionsObj = {};
    data.categories.forEach(category => {
        const tempArr = [];
        category.cards.forEach(card => {
            tempArr.push(card.content);
        })

        solutionsObj[category.title] = tempArr;
    })
    console.log("!! solutions Arr", solutionsObj);
}

function populateGuesses(guesses) {
    var guessesDiv = document.querySelector('.guesses');
    guessesDiv.innerHTML = '';

    for (var i = 0; i < guesses; i++) {
        var circle = document.createElement('div');
        circle.classList.add("circle");
        circle.classList.add(`c-${i}`);
        guessesDiv.appendChild(circle);
    }
}

function arrayMatchesAny(targetArray, solutionsObj) {
    const sortedTargetArray = targetArray.slice().sort();

    let ret = false;

    Object.values(solutionsObj).map(key => {
        console.log(key);
        if (arraysEqual(targetArray, key)) {
            ret = true; 
        }
    });
    return ret;
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false; 
    }
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

function checkGuess() {
    console.log("Checking Guess!");
    const gridItems = document.querySelectorAll('.gameGridItem');
    if(correctCount == 4) {
        var modal = document.getElementById("alreadyWonModal");
        var closeBtn = document.getElementsByClassName("closeAlreadyWon")[0];
        closeBtn.onclick = function() {
            closeModal(modal);
        }
        openModal(modal);
        return;
    }
    if(selectedArr.length < 4) {
        var modal = document.getElementById("select4Modal");
        var closeBtn = document.getElementsByClassName("close")[0];
        closeBtn.onclick = function() {
            closeModal(modal);
        }
        openModal(modal);
        return;
    }
    const result = arrayMatchesAny(selectedArr, solutionsObj);

    console.log("result: ", result);

    if(result == true) {
        correctCount += 1;
        displayCorrectCategory(selectedArr);
        displayCorrectModal();
        const removeArr = selectedArr
        repopulateGrid(removeArr);
        selectedArr.forEach(word => {
            gridItems.forEach(gridItem => {
                if (gridItem.textContent.includes(word)) {
                    gridItem.classList.add("correct")
                    gridItem.classList.remove('red-animation');
                    gridItem.disabled = true;
                    return; 
                }
            });
        });
        selectedArr = [];
    }
    else {
        selectedArr.forEach(word => {
            gridItems.forEach(gridItem => {
                if (gridItem.textContent.includes(word)) {
                    gridItem.classList.add('red-animation');
                    setTimeout(() => {
                        gridItem.classList.remove('red-animation');
                    }, 1000);
                }
            });
        });
        console.log("dat boi is false");
        decrementGuess();
        if(guesses == 0) {
            gridItems.forEach(item => {
                item.disabled = true;
                item.style.pointerEvents = 'none';
            });
            displayFailedModal();
        }
    }
}

function decrementGuess() {
    guesses--;
    const circleInstance = document.querySelector(`.c-${guesses}`);
    circleInstance.classList.add("circleHide");
}

function openModal(modal) {
    modal.style.display = "block";
}

// Function to close modal
function closeModal(modal) {
    modal.style.display = "none";
}

function displayCorrectCategory(selectedArr) {
    console.log("** Sol obj: ", solutionsObj);

    const correctCategoryContainer = document.querySelector('.correctCategoryContainer');

    const selectedArrDisplayable = selectedArr.join(", ");

    Object.entries(solutionsObj).map(([key, value]) => {
        console.log(value);
        if (arraysEqual(selectedArr, value)) {
            console.log('Title:', key);

            const category = document.createElement("div");

            const title = document.createElement("p");
            title.innerHTML = key + ":";
            title.classList.add("titleCategory");

            const words = document.createElement("p");
            words.innerHTML = selectedArrDisplayable;
            words.classList.add("wordsCategory");

            category.classList.add("correctCategory");
            category.appendChild(title);
            category.appendChild(words);
            correctCategoryContainer.appendChild(category);
        }
    });
}

function repopulateGrid(removeArr) {

    const gameGrid = document.querySelector('.gameGrid');

    const gridItems = Array.from(gameGrid.querySelectorAll('.gameGridItem'));

    gameGrid.innerHTML = '';

    var gridItemsText = [];
    gridItems.map(item => gridItemsText.push(item.textContent));

    console.log("!!** ", gridItems);
    console.log("!!** ", gridItemsText);

    const filteredGridItemsText = gridItemsText.filter(word => !removeArr.includes(word));

    filteredGridItemsText.forEach(word => {
        const gridItem = document.createElement('button');
        gridItem.classList.add('gameGridItem');
        gridItem.textContent = `${word}`;
        gridItem.addEventListener('click', function() {
            console.log("Button clickied!");
            if(selectedArr.includes(word)) {
                gridItem.classList.toggle('selected');
                selectedArr = removeFromArrayIfExists(selectedArr, word);
            }
            else {
                if(selectedArr.length < 4) {
                    gridItem.classList.toggle('selected');
                    selectedArr.push(word);
                }
            }
            console.log(selectedArr);
        });
        gameGrid.appendChild(gridItem);
    })

    selectedArr = [];
}

function displayCorrectModal() {
    if(correctCount == 4) {
        var modal = document.getElementById("correctModal");
        var closeBtn = document.getElementsByClassName("closeCorrectModal")[0];
        closeBtn.onclick = function() {
            closeModal(modal);
        }
        openModal(modal);
    }
}

function displayFailedModal() {
    console.log("!! display Failed modal");
    var modal = document.getElementById("failedModal");
    openModal(modal);
}

function clearSelections() {
    selectedArr = [];

    const gameGrid = document.querySelector('.gameGrid');
    const gridItems = Array.from(gameGrid.querySelectorAll('.gameGridItem'));

    gridItems.forEach(item => {
        if(item.classList.contains('selected')) {
            item.classList.remove('selected');
        }
    });
}

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

function populateSelectorDates() {
    const mySelect = document.getElementById('dateSelect');

    // Populate the select element with options from the array
    dateArray.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.textContent = option;
        mySelect.appendChild(optionElement);
    });
}

function setSelectorCurrDate() {
    const mySelect = document.getElementById('dateSelect');
    mySelect.value = currentGameDate;
}

function handleSelectChange() {
    currentGameDate = document.getElementById('dateSelect').value;
    retryGame();
}