export default class Cursor {
  #interval = null;
  #el = document.getElementById('crosshair');
  #keycode = null;
  #bounds = null;
  #pos = {
    x: 400,
    y: 300
  }

  constructor() {
    this.#bounds = document.getElementById('world').getBoundingClientRect();
    this.#el.style.display = 'block';
    this.#updateElement();
    document.onkeydown = e => {
      if (this.#interval !== null) return;

      let dir = null;
      switch (e.keyCode) {
        case 87:
          dir = 0;
          break;
        case 83:
          dir = 1;
          break;
        case 65:
          dir = 2;
          break;
        case 68:
          dir = 3;
          break;
        default:
          return;
      }

      this.#keycode = e.keyCode;
      this.#interval = setInterval(() => this.#move(dir), 50);
    };
    document.onkeyup = e => {
      if (e.keyCode !== this.#keycode) return;
      clearInterval(this.#interval);
      this.#interval = null;
    };
  }

  #move = (direction) => {
    switch (direction) {
      case 0:
        if (this.#pos.y - 10 < this.#bounds.top) return;
        this.#pos.y -= 10;
        break;
      case 1:
        if (this.#pos.y + 10 + this.#el.height > this.#bounds.top + this.#bounds.height) return;
        this.#pos.y += 10;
        break;
      case 2:
        if (this.#pos.x - 10 < this.#bounds.left) return;
        this.#pos.x -= 10;
        break;
      case 3:
        if (this.#pos.x + 10 + this.#el.width > this.#bounds.left + this.#bounds.width) return;
        this.#pos.x += 10;
        break;
    }
    this.#updateElement();
  }

  #updateElement = () => {
    this.#el.style.top = `${this.#pos.y}px`;
    this.#el.style.left = `${this.#pos.x}px`;
  }
}
