export let Controller = class {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.addListener((e) => {
            switch (e) {
                case "up":
                    this.model.move("up");
                    this.view.renderBoard();
                    this.view.updateScore();
                    break;
                case "down":
                    this.model.move("down");
                    this.view.renderBoard();
                    this.view.updateScore();
                    break;
                case "left":
                    this.model.move("left");
                    this.view.renderBoard();
                    this.view.updateScore();
                    break;
                case "right":
                    this.model.move("right");
                    this.view.renderBoard();
                    this.view.updateScore();
                    break;
            }
        });
        this.view.addListener((e => {
            if(e == "new") {
                this.model.setupNewGame();
                this.view.reset();
            }
        }))
    }

}