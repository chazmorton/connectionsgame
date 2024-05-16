var selectedArr = [];
var solutionsArr = [];
var guesses = 4;
var shuffledWords = [];

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

    // var shuffledWords = [];

    const gameDate = document.querySelector('.gameDate');
    gameDate.innerHTML = '';
    const date = document.createElement('p');
    date.classList.add('gameDate');
    date.textContent = `Archive Date: ${data.print_date}`;
    gameDate.appendChild(date);

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
    console.log("HYEYYYY", data);
    solutionsArr = []
    data.categories.forEach(category => {
        const tempArr = [];
        category.cards.forEach(card => {
            tempArr.push(card.content);
        })
        solutionsArr.push(tempArr);
    })
    console.log(solutionsArr);
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

function arrayMatchesAny(targetArray, arrayOfArrays) {
    const sortedTargetArray = targetArray.slice().sort();

    // Iterate over the array of arrays
    for (const arr of arrayOfArrays) {
        // Sort the current array before comparing
        const sortedArr = arr.slice().sort();
        // Check if the sorted arrays are equal
        if (arraysEqual(sortedTargetArray, sortedArr)) {
            return true; // If match found, return true
        }
    }
    return false; // If no match found, return false
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false; // If lengths are different, arrays cannot be equal
    }
    
    // Compare the arrays element by element
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false; // If any corresponding elements are different, the arrays are not equal
        }
    }

    return true; // If all elements are equal, the arrays are equal
}

function checkGuess() {
    console.log("Checking Guess!");
    const gridItems = document.querySelectorAll('.gameGridItem');
    if(selectedArr.length < 4) {
        var modal = document.getElementById("select4Modal");
        var closeBtn = document.getElementsByClassName("close")[0];
        closeBtn.onclick = function() {
            closeModal(modal);
        }
        openModal(modal);
        return;
    }
    const result = arrayMatchesAny(selectedArr, solutionsArr);

    console.log(result);

    if(result == true) {
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