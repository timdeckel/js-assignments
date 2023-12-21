const userInput = document.getElementById('input');
const wrongGuessDisplay = document.getElementById('wrong-guesses');
const correctGuess = document.getElementById('correct-guesses');
const guessButton = document.getElementById('guess-button');
const resetButton = document.getElementById('reset-button');
const easyButton = document.getElementById("easy-button");
const mediumButton = document.getElementById("medium-button");
const hardButton = document.getElementById("hard-button");
const hintContainer = document.getElementById("hint");
const gallowImage = document.getElementById("gallow-image");
const highscore = document.getElementById("highscore-list");
const overlay = document.getElementById("overlay");
const playAgainButton = document.getElementById("play-again");
const overlayTextContent = document.getElementById('text-content');
const userNameInput = document.getElementById('username-input');
const userNameSubmitButton = document.getElementById('username-submit');
const settingsButton = document.getElementById("settings-icon");
const dropdownContent = document.getElementById("settings-list");
const darkmodeSwitch = document.getElementById('toggle');

const allWords = [
    ['forest', 'mountain', 'river', 'sunrise', 'meadow', 'waterfall', 'flora', 'serenity', 'wildlife', 'breeze'],
    ['algorithm', 'robotics', 'cyberspace', 'innovation', 'automation', 'digital', 'artificial', 'programming', 'data', 'virtual'],
    ['gourmet', 'zesty', 'savory', 'delectable', 'crispy', 'decadent', 'spicy', 'mouthwatering', 'flavorful', 'exquisite'],
    ['adventure', 'explore', 'journey', 'wanderlust', 'destination', 'discovery', 'odyssey', 'itinerary', 'sojourn', 'roam'],
    ['melody', 'harmony', 'rhythm', 'crescendo', 'serenade', 'symphony', 'beat', 'tune', 'chorus', 'sonata'],
    ['canvas', 'sculpture', 'palette', 'inspiration', 'aesthetic', 'creativity', 'masterpiece', 'imagination', 'gallery', 'expression'],
    ['chic', 'couture', 'elegance', 'trendsetter', 'ensemble', 'style', 'haute', 'runway', 'glamour', 'designer'],
    ['victory', 'stamina', 'teamwork', 'athlete', 'championship', 'compete', 'endurance', 'training', 'adrenaline', 'score'],
    ['serenity', 'jubilation', 'solitude', 'compassion', 'resilience', 'tranquility', 'elation', 'contentment', 'empathy', 'courage']
];

const catagoryHints = ['Nature', 'Technology', 'Food', 'Travel', 'Music', 'Art', 'Fashion', 'Sports', 'Emotions'];

let userName = '';
let userGuess;
let selectedWord;
let secretWordArray = new Array();
let guessedCharacterArray = new Array();
let incorrectGuessArray = new Array();
let correctGuessCount = 0;
let wrongGuessCount = 0;
let winStreak = 0;
let maxWrongGuesses = 9;// fixa svårighetsknapp
let currentDifficulty = "easy"

userInput.addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        userGuess = document.getElementById("input").value;
        validateGuess(userGuess.toLowerCase());
    }
});

guessButton.addEventListener('click', function(){
    if(userInput.value === ''){
        guessButton.classList.add('shake-animation');
        setTimeout(function(){
            guessButton.classList.remove('shake-animation');
        }, 500);
    }else{
        validateGuess(userInput.value);
    }
});

//lägg till att om man inte klickar i dropdown elementet som nu syns så försvinner den
settingsButton.addEventListener('click', function(){
    let themeFlag = document.getElementById('theme-switch');
    let togglemenu = document.getElementById('settings-list');
    
    if (themeFlag.classList.contains('light-theme')) {
        if(togglemenu.classList.contains('hidden')){
            settingsButton.src = "images/Active-Settings-Light.png";
        }else {
            settingsButton.src = "images/Settings-Light.png";
        }
    } else if (themeFlag.classList.contains('dark-theme')) {
        if(togglemenu.classList.contains('hidden')){
            settingsButton.src = "images/Active-Settings-Dark.png";
        }else {
            settingsButton.src = "images/Settings-Dark.png";
        }
    }
    togglemenu.classList.toggle('hidden');
});


darkmodeSwitch.addEventListener('click', function() {
    let themeFlag = document.getElementById('theme-switch');
    let root = document.documentElement;
  
    if (themeFlag.classList.contains('light-theme')) {
        console.log('Switching to dark theme');
        root.style.setProperty('--primary', '#16213E');
        root.style.setProperty('--secondary', '#0F3460');
        root.style.setProperty('--tertiery', '#533483');
        root.style.setProperty('--accent', '#E94560');
        themeFlag.classList.replace('light-theme', 'dark-theme');
        settingsButton.src = settingsButton.src.replace('Light', 'Dark');
    } else if (themeFlag.classList.contains('dark-theme')) {
        console.log('Switching to light theme');
        root.style.setProperty('--primary', '#96B6C5');
        root.style.setProperty('--secondary', '#ADC4CE');
        root.style.setProperty('--tertiery', '#EEE0C9');
        root.style.setProperty('--accent', '#F1F0E8');  
        themeFlag.classList.replace('dark-theme', 'light-theme');
        settingsButton.src = settingsButton.src.replace('Dark', 'Light');
    }
});



// WIP kan behöva lägga till ngt mer här för typ prepgame eller likande
playAgainButton.addEventListener('click', function(){
    overlay.classList.add('hidden');
    resetGame();
    //hard reset?
});

userNameSubmitButton.addEventListener('click', function () {
    let userInputElement = document.getElementById('username-input-element');
    if(userInputElement.value !== ''){ // lägg till check om username redan finns ||
        updateHighscore(userInputElement.value);
        overlay.classList.add('hidden');
        resetGame();
    } else {
        userNameSubmitButton.classList.add('shake-animation');
        userInputElement.placeholder = " Enter a Username to save your score!"
        setTimeout(function(){
            userNameSubmitButton.classList.remove('shake-animation');
        }, 500);
    }
})

easyButton.addEventListener('click', function() {changeDifficulty("easy")});
mediumButton.addEventListener('click', function() {changeDifficulty("medium")});
hardButton.addEventListener('click', function() {changeDifficulty("hard")});

resetButton.addEventListener('click', resetGame);


function createCharacterElement(content, id, type) {// makes the DOM element for the characters
    var div = document.createElement('div');
    div.classList.add('character-box')
    var character = document.createElement('p');
    character.id = type + id;
    character.textContent = content.toUpperCase();
    div.appendChild(character);
    if(type === 'correct-nr-'){
        character.classList.add('hidden');
        div.id = "correct-container-" + id;
    }else {
        div.id = "wrong-container-" + id;
    }
    return div;
}

function prepGame(){
    userInput.placeholder = "Enter your guess here!"
    let randomArray = getRandomElementIn(allWords);
    console.log(randomArray)
    selectedWord = getRandomElementIn(randomArray);
    console.log(selectedWord);
    for(let i = 0; i < selectedWord.length; i++){
        secretWordArray.push(selectedWord[i]);
        correctGuess.appendChild(createCharacterElement(selectedWord[i], i, 'correct-nr-'));
    }
    getHint();
}

function getRandomElementIn(array){
    let randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function hardReset(){
    //för när man vill starta om, ska sätta alla variabler till noll, winstreak osv. rnesa highscore typ
}

function resetGame(){
    for(let i = 0; i < selectedWord.length; i++){
        document.getElementById("correct-container-" + i).remove();
    }
    for(let i = 0; i < incorrectGuessArray.length; i++){
        document.getElementById("wrong-container-" + i).remove();
    }
    incorrectGuessArray.length = 0;
    guessedCharacterArray.length = 0;
    secretWordArray.length = 0;
    correctGuessCount = 0;
    wrongGuessCount = 0;
    updateGallow(0);
    prepGame()
}

function goAgainPrompt(reason){
    let topText = document.getElementById('top-text');
    let bottomText = document.getElementById('bottom-text');
    if(reason === 'lost' && winStreak !== 0){
        let loseText = winStreak === 0 ? '' :  `But you guessed ${winStreak} words correctly! `;
        userNameInput.classList.remove('hidden');
        bottomText.textContent = '';
        topText.textContent = `You did not guess the secret word in time. ${loseText} Enter your name to save your Highscore!`;
    }else if(reason === 'lost' && winStreak === 0){
        userNameInput.classList.add('hidden');
        bottomText.textContent = '';
        topText.textContent = 'You did not guess the secret word in time. try again!';
    } else {
        let winText = wrongGuessCount === 0 ? "Flawless! you got it without any wrong guesses!" : `good job! You only had ${wrongGuessCount} wrong guesses!`;
        userNameInput.classList.add('hidden');
        topText.textContent =`Your current winstreak: ${winStreak}.`;
        bottomText.textContent = `You guessed the secret word ${selectedWord}, ` + winText;
    }
    overlay.classList.remove('hidden');
}

function validateGuess(guess){
    let correctGuess = false;
    if(!checkForDigits(guess)){
        if(guess.length === 1){
            if(checkIfNewGuess(guess)){
                for(let i = 0; i < selectedWord.length; i++){
                    if(guess === secretWordArray[i]){
                        document.getElementById('correct-nr-' + i).classList.remove("hidden");
                        correctGuessCount++
                        correctGuess = true;
                        document.getElementById('input').value = '';
                        checkIfWon();
                    }
                }
                if(correctGuess === false){
                    wrongGuessDisplay.appendChild(createCharacterElement(guess, incorrectGuessArray.length, "wrong-character-"));
                    incorrectGuessArray.push(guess); //works on easy but not on medium or hard, not an array?
                    document.getElementById('input').value = '';
                    checkIfLost();
                }
            }
            document.getElementById('input').value= '';
        }else if(guess.length > 1){
            if(guess === selectedWord){
                for(let i = 0; i < selectedWord.length; i++){
                    document.getElementById("correct-nr-"+i).classList.remove("hidden");
                    correctGuess = true;
                }
                document.getElementById('input').value= '';
                correctGuessCount = selectedWord.length;
                checkIfWon();
            }if(correctGuess === false){
                document.getElementById('input').value= '';
                checkIfLost();
            }
        } 
    }else {
        alert("no numbers, stop it.");
        userInput.value = '';
    }
}

function checkForDigits(string){
    return /\d/.test(string);
}

function checkIfLost(){//INTE KLAR FIXA SENARE
    wrongGuessCount++

    updateGallow(wrongGuessCount);
    if(wrongGuessCount === maxWrongGuesses){
        goAgainPrompt('lost');
    }
}

function checkIfNewGuess(guess){
    for (let i = 0; i < guessedCharacterArray.length; i++) {
        if(guess === guessedCharacterArray[i]){
            return false;
        }
    }
    guessedCharacterArray.push(guess);
    return true;
}

function checkIfWon(){
    if(correctGuessCount === selectedWord.length){
        winStreak++;
        goAgainPrompt();
    }
}

function changeDifficulty(clickedDifficulty){
    if(clickedDifficulty !== currentDifficulty){
        document.getElementById(currentDifficulty + "-button").classList.remove("active-difficulty");
        document.getElementById(clickedDifficulty + "-button").classList.add("active-difficulty");
        currentDifficulty = clickedDifficulty;
        switch(currentDifficulty){
            case "easy":
                maxWrongGuesses = 9;
                document.getElementById("hint").classList.remove('hidden');
                resetGame();
            break;
            case "medium":
                maxWrongGuesses = 6;
                document.getElementById("hint").classList.add('hidden');
                resetGame();
            break;
            case "hard":
                maxWrongGuesses = 3;
                document.getElementById("hint").classList.add('hidden');
                resetGame();
            break;
        }
    }
}

function getHint(){// i needed a while loop and a loop in a loop. so here it is.
    let outerIndex = 0;
    while(outerIndex < allWords.length){
        let catagoryArray = allWords[outerIndex];
        for(let innerIndex = 0; innerIndex < catagoryArray.length; innerIndex++){
            if(catagoryArray[innerIndex] === selectedWord){
                let hint = catagoryHints[outerIndex];
                hintContainer.textContent = "Hint: " + hint;
            }
        }
        outerIndex++;
    }
}

function updateGallow(oofNumber){
   switch (currentDifficulty) {
       case "easy":
            gallowImage.src = "images/Hangman-"+oofNumber+".png";
            break;
        case  "medium":
            gallowImage.src = "images/Hangman-"+(Math.floor(oofNumber * 1.5))+".png";
            break;
        case  "hard":
            gallowImage.src = "images/Hangman-"+(oofNumber * 3)+".png";
            break;
       default:
           break;
   }
    
}


// kan behöva skrivas om så den uppdaterar listan korrekt
//dvs efter highscore och inte efter kronologisk ordning
function updateHighscore(userName){
    console.log(userName)
    let highscoreWrapper = document.createElement('div');
    highscoreWrapper.classList.add('highscore-container')
    let highscoreElement = document.createElement("p");
    highscoreWrapper.appendChild(highscoreElement);
    highscoreElement.textContent = userName + `: ${winStreak}`;
    highscore.appendChild(highscoreWrapper);
}


prepGame();
console.log(secretWordArray);//  ska bort sen



/* ATT GÖRA

- fixa så highscore funkar

- fixa vinst och förlust meddelande som inte stör visandet av alla bokstäver.

- fixa frågandet av namn för highscore

- fixa så att input wrappers barn försvinner och en ny knapp och vinst/förlust medelande är där istället.

- städa kod

- gör det fint   




*/




