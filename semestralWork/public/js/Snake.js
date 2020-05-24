/**
 * Snake class, defines it's logic.
 */
export default class Snake {
    constructor(x, y, difficulty) {
        this._direction = {
            LEFT: 0,
            RIGHT: 1,
            UP: 2,
            DOWN: 3,
            NONE: 4
          };
      this._movement = this._direction.NONE; //actual direction
      this._next = this._direction.NONE; //next direction
      this._length = 3; //base length of snake
      this._trail = []; //body of snake
      this._position = { //coords of snake
        x: x,
        y: y
      }; 
      this._score = 0; //player's score
      this._scoreBox = document.getElementById("scoreValue");
        switch(difficulty){
          case 120:
            this._velocity = 1;
            break;
          case 80:
            this._velocity = 2;
            break;
          case 50:
            this._velocity = 5;
            break;
        }
    }
  
    /**
     * Sets next direction of the snake
     * @param {direction} newDir - New snake's direction
     */
    setDirection(newDir) {
      this._next = newDir;
    }
  
    /**
     * Update snake. Sets it's direction, detects collision with apple, controlls sound while eating apple, 
     * moves with snake's body.
     * @param {Apple} apple - Apple object
     * @param {Sound} sound - Sound object
     */
    update(apple, sound, ctx) {
      //checks if there is a body collision
      this.gameOver(ctx);

      //Snake can't switch direction to opposite side.
      if (
        (this._next === this._direction.DOWN && this._movement !== this._direction.UP) ||
        (this._next === this._direction.UP && this._movement !== this._direction.DOWN) ||
        (this._next === this._direction.LEFT && this._movement !== this._direction.RIGHT) ||
        (this._next === this._direction.RIGHT && this._movement !== this._direction.LEFT)
      ) {
        this._movement = this._next; //change the direction
      }
      
      //On the beginning of the game, snake doesn't move
      if (this._movement === this._direction.NONE) return;
  
      //For move snake's body. Pushing a new object with calculated coordinates and then deleting the first.
      this._trail.push({
        x: this._position.x,
        y: this._position.y
      });
      while (this._trail.length >= this._length) {
        this._trail.shift()
      };
  
      //Change coords by direction
      switch (this._movement) {
        case this._direction.UP:
          this._position.y--;
          break;
        case this._direction.DOWN:
          this._position.y++;
          break;
        case this._direction.RIGHT:
          this._position.x++;
          break;
        case this._direction.LEFT:
          this._position.x--;
          break;
      }
  
      //Snake & Apple collision
      if (this._position.x === apple.getCoords().x && this._position.y === apple.getCoords().y) {
        this._generateApple(apple); //generate a new apple
        this._length+= this._velocity; //get longer body, depends on difficulty
        //console.log(this._score);
        //console.log(this._velocity);
        this._score = this._velocity + this._score; //get points, depends on difficulty
        this._scoreBox.innerHTML = this._score; //rewrite score
        sound.play(); //play "eat apple" sound
        //Play "eat apple" sound again, even it is playing right now, because player
        //quickly ate a new apple again.
        if(!sound.paused()){
          const newSound = sound.cloneNode();
          newSound.play();
        }
      }
  
      //Gameboard borders
      if (this._position.x < 0) {
        this._position.x = 19;
      } else if (this._position.x > 19) {
        this._position.x = 0;
      }
      if (this._position.y < 0) {
        this._position.y = 19;
      } else if (this._position.y > 19) {
        this._position.y = 0;
      }

      
    }
  
    /**
     * Draws a snake. 
     * @param {CanvasRenderingContext2D} ctx - canvas context
     */
    draw(ctx) {
      ctx.fillStyle = '#aebdf5';
      for (const block of this._trail) {
        ctx.fillRect(block.x * 25 + 1, block.y * 25 + 1, 23, 23);
      }
    
      ctx.fillStyle = '#7289DA';
      ctx.fillRect(this._position.x * 25 + 1, this._position.y * 25 + 1, 23, 23);

    }
  
    /**
     * Generates a new position of apple. Apple can't be generated where the Snake is. 
     * @param {Apple} apple - apple object
     */
    _generateApple(apple) {
      const applePos = {};
  
      generator:
      while (true) {
        applePos.x = Math.floor(Math.random() * 20);
        applePos.y = Math.floor(Math.random() * 20);
  
        if (applePos.x === this._position.x && applePos.y === this._position.y) continue;
        for (const tile of this._trail) {
          if (applePos.x === tile.x && applePos.y === tile.y) continue generator;
        }
  
        break;
      }
  
      apple.setCoords(applePos.x, applePos.y);
    }

    /**
     * Checks snake's body collision. If there is a collision, the game over occurs.
     * @param {CanvasRenderingContext2D} ctx 
     */
    gameOver(ctx){
      let trail = this._trail.slice(1);
        if (trail.some(s => s.x === this._position.x && s.y === this._position.y)) {
          return true;
        }
    }

  }