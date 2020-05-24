import Apple from './Apple.js';
import Snake from './Snake.js';
import Sound from './Sound.js';


const canv = document.getElementById('gameCanvas');
const ctx = canv.getContext('2d');

//Local Storage
let storage = window.localStorage;

// Firebase Configuration
var firebaseConfig = {
  apiKey: "AIzaSyDoY3-C84u8ye9D3nKpHAUHz2FwcU60T8Y",
  authDomain: "snekkgame.firebaseapp.com",
  databaseURL: "https://snekkgame.firebaseio.com",
  projectId: "snekkgame",
  storageBucket: "snekkgame.appspot.com",
  messagingSenderId: "701878242916",
  appId: "1:701878242916:web:27eaef58b71ab4fc741971",
  measurementId: "G-ZXMEDF76FJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics(); 

//Firebase Database
var db = firebase.firestore();
//get scores from Firebase Database
var scoresDb = db.collection("scores");

//Direction of the
const Direction = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
  NONE: 4
};


let gameButt = document.getElementsByClassName("gameButt")[0]; //gameButt(on)
let leaderBoardButt = document.getElementsByClassName("leaderButt")[0]; //leaderBoardButt(on)

//display game 
gameButt.addEventListener('click', function () {
  if (!gameButt.classList.contains("active")) {
    gameButt.classList.add("active");
    leaderBoardButt.classList.remove("active");
    let modal = document.getElementsByClassName("modal")[0];
    modal.style.display = "block";
    let leaderBoard = document.getElementsByClassName("leaderBoard")[0];
    leaderBoard.style.display = "none";
    canv.style.display = "block";
  }
});

//display leaderboard
leaderBoardButt.addEventListener('click', function () {
  if (!leaderBoardButt.classList.contains("active")) {
    leaderBoardButt.classList.add("active");
    gameButt.classList.remove("active");
    let modal = document.getElementsByClassName("modal")[0];
    modal.style.display = "none";
    createLeaderboard();
  }
});

/**
 * Creates a modal window of Main menu.
 */
function createMainMenu() {
  let modal = document.getElementsByClassName("modal")[0];
  modal.innerHTML = `
        <form id="startGameModal">
            <h2>Choose difficulty</h2>
            <div class="choice">
                <input type="radio" name="difficulty" value="easy" id="easy" checked>
                <label for="easy">Easy <span>(1x points)</span></label>
            </div>
            <div class="choice">
                <input type="radio" name="difficulty" value="medium" id="medium">
                <label for="medium">Medium <span>(2x points)</span></label>
            </div>
            <div class="choice">
                <input type="radio" name="difficulty" value="hard" id="hard">
                <label for="hard">Hard <span>(5x points)</span></label>
            </div>
                <button id="playButt" type="button">Start</button>
        </form>
  `;
  let playButt = document.getElementById("playButt"); //playButt(on)
  playButt.addEventListener("click", function () {
    console.log('Start game butt pressed');
    modal.style.display = "none"; //hide modal
    let diffValue = document.querySelector('input[name="difficulty"]:checked').value; //get value of radio input
    let velocity = 0;
    //Difficulty
    switch (diffValue) {
      case "easy":
        velocity = 120;
        break;
      case "medium":
        velocity = 80;
        break;
      case "hard":
        velocity = 50;
        break;
    }
    startGame(velocity);
  })


}

/**
 * Creates Game Over window
 */
function createGameOver() {
  let modal = document.getElementsByClassName("modal")[0];
  modal.innerHTML = `
      <div class="modal">
        <form id="gameOverModal" onkeydown="return event.key != 'Enter';">
            <h2>Game over!</h2>
            <label for="nameField">Type your name: </label>
            <input type="text" name="nameField" id="nameField" placeholder="Sam Sung" autofocus>
            <button id="submitButt" type="button">Submit</button>
        </form>
      </div>
  `

  let input = document.getElementById("nameField");
  let score = document.getElementById("scoreValue");
  let submitButt = document.getElementById("submitButt"); //submitButt(on)
  modal.style.display = "block";

  submitButt.addEventListener("click", function () {
    if (validateName(input.value)) {
      let name = input.value;
      storage.setItem(name, score.innerHTML); //add to localstorage
      scoresDb.doc(name).set({ score: score.innerHTML }) //add to Firebase database
        .then(function () {
          console.log("Hotovka.");
        })
        .catch(function (error) {
          console.error("Ajeje.");
        });
      leaderBoardButt.removeAttribute("disabled"); //we can see leaderboard now
      modal.style.display = "none";
      createLeaderboard(); //display leaderboard
      leaderBoardButt.classList.add("active");
      gameButt.classList.remove("active");
      createMainMenu(); //when we go back to "Game", we can see main menu again now.
    }
  })

}

/**
 * 
 * @param {string} input - Player's name
 */
function validateName(input) {
  //if player didn't type his name
  if (input.length == 0) {
    alert("Please, type your name.");
    return false;
  }
  //if player's typed name is too long
  else if(input.length > 18){
    alert("The name is too long.");
    return false;
  }
  return true;
}


/**
 * Starts game logic.
 * @param {difficulty} difficulty 
 */
function startGame(difficulty) {
  //if player'd done game before, reset score.
  let score = document.getElementById("scoreValue");
  score.innerHTML = "0";
  //disable leaderboard button, because we don't want to switch to leaderborad while playing.
  leaderBoardButt.setAttribute("disabled", "");
  
  //define snake, apple, sounds
  const snake = new Snake(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20), difficulty);
  const apple = new Apple(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20));
  const soundtrack = new Sound("../soundtrackGame.mp3");
  const soundEatApple = new Sound("../eatApple.mp3");
  const soundGameOver = new Sound("../gameOver.mp3");

  //soundtrack plays in loop
  soundtrack.play();
  document.getElementsByClassName("sound")[0].loop = true;

  //game loop
  let game = setInterval(() => {
    //background
    ctx.fillStyle = '#23272A';
    ctx.fillRect(0, 0, canv.width, canv.height);

    //snake logic, snake and apple drawing
    snake.update(apple, soundEatApple, ctx);
    apple.draw(ctx);
    snake.draw(ctx);

    //game over
    if (snake.gameOver()) {
      soundtrack.stop(); //stop soundtrack
      soundGameOver.play(); //game over sound
      clearInterval(game); //stop game loop
      createGameOver(); //create game over modal
    }
  }, difficulty);

  /**
   * Arrow Snake controller
   * Prevents from scrolling the page by default.
   */
  document.addEventListener('keydown', e => {
    switch (e.keyCode) {
      case 38: //up arrow
        snake.setDirection(Direction.UP);
        e.preventDefault();
        break;
      case 40: //down arrow
        snake.setDirection(Direction.DOWN);
        e.preventDefault();
        break;
      case 37: //left arrow
        snake.setDirection(Direction.LEFT);
        e.preventDefault();
        break;
      case 39: //right arrow
        snake.setDirection(Direction.RIGHT);
        e.preventDefault();
        break;
    }
  });
}

/**
 * Creates leaderboard window
 * leaderboard is implemented in 2 ways (Firebase or localStorage).
 * Now it's using Firebase database, but localStorage is implemented too and it's
 * data can be written in leaderboard too.
 */
function createLeaderboard() {
  let leaderBoard = document.getElementsByClassName("leaderBoard")[0];
  leaderBoard.style.display = "block";
  let modal = document.getElementsByClassName("modal")[0];
  canv.style.display = "none";
  modal.style.display = "none"; //hide modal window
  var htmlArray = []; //array, where template literals will be pushed
  let sortedData = new Map(); //local storage map
  sortedData = localStorageSort().reverse(); //now local storage sorted map
  let sortedFirebaseData = new Map(); //data map from Firebase database

  //push header
  htmlArray.push(`
  <h2>Leaderboard</h2>
  <div class="group">
      <div class="item heading">#</div>
      <div class="item heading">Name</div>
      <div class="item heading">Score</div>
    </div>
  `);

  //Reading data from local storage
  /*
  let i = 0;
  for(let [key, value] of sortedData){
    htmlArray.push(`
    <div class="group">
      <div class="item">${i+1}</div>
      <div class="item">${key}</div>
      <div class="item">${value}</div>
    </div>
  `);
  i++;
  }
  */


  //Firebase database is implemented as "document" (doc) and it's values. 
  //Here, document means player's name and we store in it player's score.
  db.collection("scores").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      sortedFirebaseData.set(doc.id, doc.data().score) //set document data to map
    });
  }).catch((error) => {console.log(error)}).then(() => {
    let i = 0;
    //read data from SORTED map and push it to array
    for (let [key, value] of firebaseStorageSort(sortedFirebaseData).reverse()) {
      htmlArray.push(`
      <div class="group">
        <div class="item">${i + 1}</div>
        <div class="item">${key}</div>
        <div class="item">${value}</div>
      </div>
    `);
      i++;
    }
    leaderBoard.innerHTML = htmlArray.join('');
  }).catch((error) => {console.log(error)});

}

/**
 * Sorts data in map from Firebase database.
 * @param {Map} map 
 */
function firebaseStorageSort(map) {
  map[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
  }

  return [...map];
}


/**
 * Reads data from localStorage and sorts them.
 */
function localStorageSort() {
  let map = new Map();
  for (let i = 0; i < storage.length; i++) {
    map.set(storage.key(i), storage.getItem(storage.key(i)));
  }

  map[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
  }

  return [...map];
}

if (gameButt.classList.contains("active")) {
  createMainMenu();
}


