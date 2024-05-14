var selectedArr = [];
var solutionsArr = [];

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
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function shuffle(array) { 
    for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
}; 

function populateGrid(data) {

    var shuffledWords = [];

    const gameDate = document.querySelector('.gameDate');
    gameDate.innerHTML = '';
    const date = document.createElement('p');
    date.classList.add('gameDate');
    date.textContent = `${data.print_date}`;
    gameDate.appendChild(date);

    const gameGrid = document.querySelector('.gameGrid');
    gameGrid.innerHTML = ''; 

    console.log(data.categories);
    data.categories.forEach(category => {
        category.cards.forEach(word => {
            shuffledWords.push(word.content);
        })
    });

    shuffledWords = shuffle(shuffledWords);

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
    // console.log("Checking guess: ", selectedArr);
    // console.log("Sol array: ", solutionsArr);
    const result = arrayMatchesAny(selectedArr, solutionsArr);

    const gridItems = document.querySelectorAll('.gameGridItem');

    if(result === true) {
        selectedArr.forEach(word => {
            gridItems.forEach(gridItem => {
                if (gridItem.textContent.includes(word)) {
                    gridItem.classList.add("correct")
                    gridItem.disabled = true;
                    return; 
                }
            });
        });
        selectedArr = [];
    }
}