// here are the calculations to generate the board and compare each letter to know if it's the correct guess
// originally it imports WORDS from a list of words, but I don't want that. I want to use what I get from the database ('termo'). I can't "bring" it here, I've tried many times but it doesn't work. 

import { WORDS } from './words.js'

const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0


// to generate the index of the WORDS array
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
console.log(rightGuessString)

// generates an array from the word selected.
let rightGuess = Array.from(rightGuessString)

function initBoard() {
    let board = document.getElementById('game-board');

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("div"); 
        row.className = "letter-row";

        for (let j = 0; j < 6; j++) {
            let box = document.createElement("div");
            box.className = "letter-box"; 
            row.appendChild(box)
        }
        board.appendChild(row)
    }
}
initBoard();

function shadeKeyBoard(letter,color) {
    for (const elem of document.getElementsByClassName('keyboard-button')) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === 'green') {
                return;
            } if (oldColor === 'rgba(255, 255, 102, 1)' && color !== 'green') {
                return;
            } 
            elem.style.backgroundColor =  color
            break
        }
    }
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row") [6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess() {
     let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    
    for (const val of currentGuess) {
        guessString += val 
    }

    if (guessString.length != rightGuess.length) {
        return
    }

    if (!WORDS.includes(guessString)) {
        // alert("word not in the list")
        // return
    }

    for (let i = 0; i < rightGuess.length; i++) {
        let letterColor = ""
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])

        if (letterPosition === -1) {
            letterColor = 'rgba(117, 158, 140, .5)'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'rgba(255, 255, 102, 1)'
            }
            // rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(() => {
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
        }
        if (guessString === rightGuessString) {
            toastr.success("Parabéns, você acertou!")
            guessesRemaining = 0;
            return 
        } else {
            guessesRemaining -= 1;
            currentGuess = [];
            nextLetter = 0;

            if (guessesRemaining === 0) {
                toastr.error("Tente outra vez!")
                toastr.info(`A palavra correta era "${rightGuessString}"`)
            }
        }
    }
    

function insertLetter(pressedKey) {
        // if (nextLetter === 5) {
        if (nextLetter === rightGuess.length) {
            return;
        }
        pressedKey = pressedKey.toLowerCase()
    
        let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
        let box = row.children[nextLetter]
        animateCSS(box, "pulse")
        box.textContent = pressedKey
        box.classList.add('filled-box')
        currentGuess.push(pressedKey)
        nextLetter += 1
    }

document.addEventListener('keyup', (e) => {
    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)

    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    if (pressedKey === "F5") {
        return;
    }

    let found = pressedKey.match(/[a-z]/gi)

    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById('keyboard-cont').addEventListener('click', (e) => {
    const target = e.target
    if (!target.classList.contains('keyboard-button')) {
        return
    }
    let key = target.textContent
    if (key ===  'Del') {
        key = 'Backspace'
    }

    document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}))
})


const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});



// https://www.youtube.com/watch?v=pTeiYFUUUwk&t=12s