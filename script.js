
const screenController = (
    function(){
        const boardDiv = document.querySelector("#board");
        const gameStatusDiv = document.querySelector("#game-status");
        console.dir(gameStatusDiv);

        // Populate the board with buttons
        for (let i = 0; i < 9; i++) {
            const button = document.createElement("button");
            button.classList.add("btn")
            boardDiv.appendChild(button);
        }
    }
)();