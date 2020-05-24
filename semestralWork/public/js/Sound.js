/**
 * Sound class
 */
export default class Sound{
    constructor(src){
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.classList.add("sound");
        //this.sound.volume = 0.05;
        document.body.appendChild(this.sound);
    }

    /**
     * Play sound
     */
    play(){
        this.sound.play();
    }

    /**
     * Stop sound
     */
    stop(){
        this.sound.pause();
    }

    /**
     * Is sound paused
     */
    paused(){
        return this.sound.paused;
    }

    /**
     * Clone Sound node
     */
    cloneNode(){
        return this.sound.cloneNode();
    }

}