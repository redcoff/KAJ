export default class Virus {
    #board = document.getElementById('gameBoard');
    #el = document.createElement("img");

    constructor(){
        this.#el.style.display = 'block';
        this.#el.setAttribute("class", "virus");
        this.#el.classList.add("cursor-crosshair");
        this.#board.appendChild(this.#el);
        this.#updateElement();
        setTimeout (() => {this.#el.src = "virus.png";},1000);
    }

    #updateElement = () => {
        this.#el.style.top = `${Math.floor(Math.random()*330)+70}px`;
        this.#el.style.left = `${Math.floor(Math.random()*700)+70}px`;
      }
    }