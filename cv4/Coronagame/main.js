import Cursor from './Cursor.js';
import imageLoader from './ImageLoader.js';
import Virus from './Virus.js';

let score = 0;
let eliminated = 0;
let missed = 0;
let loosingFlag = document.getElementById('loosingFlag');
let gameBoard = document.getElementById('gameBoard');



(async function () {
  let startNewGameButt = document.getElementById("startButton");
  let world = document.getElementById('world');


  // --- Hra zacina ---
  startNewGameButt.onclick = () => {
    //-- Ovladani --
    //klavesnice
    if (document.getElementById("controller1").checked) {
      const cursor = new Cursor();
      world.classList.remove("cursor-crosshair");
      document.body.onkeydown = function (e) {
        if (e.keyCode == 32) {
          console.log('Space pressed');
        }
        playGame();
      }
    }


    //myska muska mickey mouse
    else {
      world.classList.add("cursor-crosshair");
      let virusArray = document.getElementsByClassName('virus');
      playGame();

    }
  }

  const crossImg = await imageLoader('./crosshair.png');
  const virusImg = await imageLoader('./virus.png');


})();



function playGame() {
  let virusArray = document.getElementsByClassName('virus');

  var spawning = setInterval(() => {
    var virus = new Virus();
    console.log(virusArray);
    for (let element of virusArray) {
      element.onclick = (e) => {
        score += 1;
        eliminated += 1;
        document.getElementById('score').innerHTML
          = `Score: ${score}  |  Eliminated: ${eliminated}  | Missed: ${missed}`;
        e.target.remove();
        console.log(score);
      }
    }
  }, 1500);
  var missing = setInterval(() => {
    if (loosingFlag.offsetWidth < world.offsetWidth) {
      virusArray.item(0).remove();
      missed += 1;
      score -= 1;
      document.getElementById('score').innerHTML
        = `Score: ${score}  |  Eliminated: ${eliminated}  | Missed: ${missed}`;
      loosingFlag.style.width = `${missed * 20}px`;
    }
    else {
      let endGame = document.createElement("div");
      endGame.innerHTML = "Game over.";
      endGame.setAttribute("id", "endGame");
      gameBoard.appendChild(endGame);
      clearInterval(spawning);
      clearInterval(missing);
    }
  }, 6000);

}




