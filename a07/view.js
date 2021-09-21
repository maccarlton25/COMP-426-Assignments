export let View = class {
    constructor(model) {
        this.model = model;
        this.listeners = [];
        this.tiles = [];
        const viewBoard = document.querySelector(".board");
        for(let i = 0; i < 4; i++) {
            let row = document.createElement("div");
            row.className = "row";
            for(let j = 0; j < 4; j++){
                let tile = document.createElement("div");
                tile.className = "col-3";
                if(this.model.getGameState().board[i*4+j] == 0){
                    tile.innerHTML = "";
                } else {
                    tile.innerHTML = this.model.getGameState().board[i*4+j];
                }
                row.appendChild(tile);
                this.tiles.push(tile);
            }
            viewBoard.appendChild(row);
        }
        let keydownHandler = (e) => {
            let action;
            switch(e.code) {
                case "ArrowRight":
                    action = "right";
                    break;
                case "ArrowLeft":
                    action = "left";
                    break;
                case "ArrowDown":
                    action = "down";
                    break;
                case "ArrowUp":
                    action = "up";
                    break;
            } 
            this.updateListeners(action);
        } 
        let resetHandler = (e) => {
            e.preventDefault();
            let action = "new";
            this.updateListeners(action);
        }
        $('.reset').on('click', resetHandler);
        window.addEventListener("keydown", keydownHandler);   
        this.model.addListener((e) => {
             if (e == 2) {
                 this.gameOver();
             } else if (e == 1) {
                 this.gameWon();
             }
        })
    }
    renderBoard() {
        for(let i = 0; i < 16; i++){
            if(this.model.getGameState().board[i] == 0){
                this.tiles[i].innerHTML = "";
            } else {
                this.tiles[i].innerHTML = this.model.getGameState().board[i];
            }
        }
    }
    updateScore() {
        let score = document.querySelector("#score");
        score.innerHTML = "Score: " + this.model.getGameState().score;
    }
    reset() {
        $('.notification').empty();
        this.renderBoard();
        this.updateScore();
    }
    gameOver() {
        let notify = document.querySelector(".notification");
        let message = document.createElement("h3");
        message.innerHTML = "Game Over :(";
        message.className = "gameover";
        notify.appendChild(message);
        let sub = document.createElement("p");
        sub.innerHTML = "Click reset to start over!";
        notify.appendChild(sub);
    }
    gameWon() {
        let notify = document.querySelector(".notification");
        let message = document.createElement("h3");
        message.innerHTML = "Game Won :)";
        message.className = "gamewon";
        notify.appendChild(message);
        let sub = document.createElement("p");
        sub.innerHTML = "Feel free to continue playing!";
        notify.appendChild(sub);
    }
    addListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx == -1) {
            this.listeners.push(listener);
        }
    }
    removeListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx != -1) {
            this.listeners.splice(idx, 1);
        }
    }
    updateListeners(event) {
        this.listeners.forEach((l) => l(event));
    }
}