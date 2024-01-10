
const screenController = (
    function(){
        // Dependencies 
        gameController = GameController();

        const boardDiv = document.querySelector("#board");

        // Create buttons at the start of the game
        updateDisplay();  
       
        // Attach event listener to track clicks on the buttons
        boardDiv.addEventListener("click", boxClickHandler)

        function boxClickHandler (e) {
            const errorDiv = document.querySelector("#error-msg")
            try {
                errorDiv.textContent = ""
                gameController.playRound(e.target.dataset.row, e.target.dataset.col)
            } catch (e) {
                if (e instanceof GameOverTie) {
                    errorDiv.textContent = e.message;
                    boardDiv.removeEventListener("click", boxClickHandler);
                }
                else if (e instanceof BoxAlreadyFilledError){
                    errorDiv.textContent = e.message;
                }
            }
            updateDisplay();
        }


        function createButtons(board){
            boardDiv.innerHTML = '';

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col<3; col++) {
                    const button = document.createElement("button");
                    button.textContent = board[row][col];
                    button.classList.add("btn");
                    button.dataset.row = row;
                    button.dataset.col = col;
                    boardDiv.appendChild(button);
                }
            }
        }

        function updateDisplay() { 
            const gameStatusDiv = document.querySelector("#game-status");
            const currentBoard = gameController.board.getBoard();

            createButtons(currentBoard); 
            gameStatusDiv.textContent = `${gameController.getCurrentPlayer().getName()}'s turn`

        }
    }
)();

function GameController
    (
        playerOneName = "Player 1", 
        playerOneSymbol = "X", 
        playerTwoName = "Player 2",
        playerTwoSymbol = "O"
    ){

    // dependencies
    board = Board();
    
    // props
    const players = [
        Player(playerOneName, playerOneSymbol),
        Player(playerTwoName, playerTwoSymbol)
    ]
    let currentPlayer = players[0];

    // getters
    const getCurrentPlayer = () => currentPlayer;
    
    // public methods 
    const playRound = (row, col) => {
        board.markBox(row, col, currentPlayer);
        if (board.getTieStatus()) {
            throw new GameOverTie("Game over. You tied.")
        } else {
            switchPlayer();
        }
        
            
    }

    // private methods
    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    } 

    return {playRound, getCurrentPlayer, board}
}

function Board(){
    // props 
    const board = [];

    // getters 
    const getBoard = () => board;

    // Populating the board
    for (let row = 0; row < 3; row++){
        board[row] = [];
        for (let col = 0; col < 3; col++){
            board[row][col] = ''
        }
    }

    // public methods 
    const markBox = (row, col, player) => {
        if (board[row][col] === '') {
            board[row][col] =  player.getSymbol();
        } else {
            throw new BoxAlreadyFilledError("Can't overwrite a box");
        }; 
    }

    // private methods
    const getTieStatus = () => {
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                if (board[row][col] === '') return false;
            }
        }
        return true;
    }
    return {markBox, getBoard, getTieStatus}
}

function Player(name, symbol) {    
    // getters
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol};
    
}

class BoxAlreadyFilledError extends Error {
    constructor(message) {
        super(message); 
        this.name = "BoxAlreadyFilledError";
      }
}

class GameOverTie extends Error {
    constructor(message) {
        super(message);
        this.name = "GameOverTie"
    }
}