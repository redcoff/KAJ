/**
 * Apple class
 */
export default class Apple {
    constructor(x, y) {
      //coords
      this._x = x;
      this._y = y;
    }
  
    /**
     * returns coords of Apple
     */
    getCoords() {
      return {
        x: this._x,
        y: this._y
      };
    }
  
    /**
     * sets coords of Apple
     * @param {int} x 
     * @param {int} y 
     */
    setCoords(x, y) {
      this._x = x;
      this._y = y;
    }
  
    /**
     * Draws apple
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this._x * 25 + 12, this._y * 25 + 12, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  