var screenController = ScreenController();
// Create buttons at the start of the game
screenController.updateDisplay();  

const resetBtn = document.querySelector("#reset-btn");
resetBtn.addEventListener("click", ()=>{
    
    screenController.detachAllListeners();
    screenController = ScreenController();
    screenController.updateDisplay(); 
});

function ScreenController() {
    // Props
    let playerOneName, playerTwoName, playerOneSymbol, playerTwoSymbol;

    // Dependencies 
    gameController = GameController(playerOneName,playerOneSymbol, playerTwoName,playerTwoSymbol);
    // Selectors
    const boardDiv = document.querySelector("#board");
    // Attach event listeners to input fields 
    updatePlayersDetails();
    // Attach event listener to track clicks on the buttons
    boardDiv.addEventListener("click", boxClickHandler)
    function boxClickHandler (e) {
        const errorDiv = document.querySelector("#error-msg")
        try {
            errorDiv.textContent = ""
            gameController.playRound(e.target.dataset.row, e.target.dataset.col)
        } catch (e) {
            if (e instanceof GameOverWin){
                errorDiv.textContent = e.winner.getName() + " won!"
                boardDiv.removeEventListener("click", boxClickHandler);
            }
            else if (e instanceof GameOverTie) {
                errorDiv.textContent = e.message;
                boardDiv.removeEventListener("click", boxClickHandler);
            }
            else if (e instanceof BoxAlreadyFilledError){
                errorDiv.textContent = e.message;
            }
            else {
                console.log(e);
                console.log(e.message);
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
    function updatePlayersDetails() {
        const playerOneNameDiv = document.querySelector("#player-one-name");
        playerOneNameDiv.addEventListener("input", ()=>{
            playerOneName = playerOneNameDiv.value;
        })
    }

    

    function detachAllListeners() {
        boardDiv.removeEventListener("click", boxClickHandler)
    }
    return {updateDisplay, detachAllListeners}
    }


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
        if (board.getWinStatus(row, col).winStatus) {
            const winner = board.getWinStatus(row, col).winnerToken
            throw new GameOverWin(getWinnerByToken(winner))
        }
        else if (board.getTieStatus()) {
            throw new GameOverTie("Game over. You tied.")
        } else {
            switchPlayer();
        }
        
            
    }

    // private methods
    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    } 

    const getWinnerByToken = (token) => {
        for (let i = 0; i<players.length; i++) {
            if (players[i].getSymbol() === token) {
                return players[i];
            }
        }
    }

    return {playRound, getCurrentPlayer, board}
}

function Board(){
    // props 
    const board = [];
    const noWinnerYet = {winStatus: false, winnerToken: null}

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
        console.log(board);
        if (board[row][col] === '') {
            board[row][col] =  player.getSymbol();
        } else {
            throw new BoxAlreadyFilledError("Can't overwrite a box");
        }; 
    }

    const getTieStatus = () => {
        for (let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++){
                if (board[row][col] === '') return false;
            }
        }
        return true;
    }

    const getWinStatus = (row, col) => {
        // Store the return value of all checks in a list 
        const checkList = [
            getRowWinStatus(row), 
            getColWinStatus(col), 
            getFirstDiagonalWinStatus(),
            getSecondDiagonalWinStatus()
        ]
        // Iterate over the list, looking for the first true winStatus
        for (result of checkList) {
            if (result.winStatus) return result;
        }
        // If none was found, return the last result, which equals noWinnerYet
        // const noWinnerYet = {winStatus: false, winnerToken: null}
        return checkList[checkList.length-1]
    }

    // private methods
    const getRowWinStatus = (row) => {
        const firstToken = board[row][0];

        if (firstToken === "") return noWinnerYet;
        for (let col = 1; col < 3; col++){
            const nextToken = board[row][col];
            if (nextToken !== firstToken)  return noWinnerYet;
        }
        
        return {winStatus: true, winnerToken: firstToken};
    }

    const getColWinStatus = (col) => {
        const firstToken = board[0][col];

        if (firstToken === "") return noWinnerYet;
        for (let row = 1; row < 3; row++){
            const nextToken = board[row][col];
            if (nextToken !== firstToken)  return noWinnerYet;
        }
        
        return {winStatus: true, winnerToken: firstToken};
    }

    const getFirstDiagonalWinStatus = () => {
        // Upper left to lower right diagonal
        
        let firstToken = board[0][0];

        if (firstToken === "") return noWinnerYet;
        for (let i = 1; i < 3; i++){
            const nextToken = board[i][i];
            if (nextToken !== firstToken)  return noWinnerYet;
        }
        
        return {winStatus: true, winnerToken: firstToken};
    }

    const getSecondDiagonalWinStatus = () => {
        // Upper right to lower left diagonal
        
        let firstToken = board[0][2];

        if (firstToken === "") return noWinnerYet;
        for (let i = 1; i < 3; i++){
            const nextToken = board[i][2-i];
            if (nextToken !== firstToken)  return noWinnerYet;
        }
        
        return {winStatus: true, winnerToken: firstToken};
    }

    return {markBox, getBoard, getTieStatus, getWinStatus}
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

class GameOverWin extends Error {
    constructor(winner) {
        super("GameOverWin"); 
        this.name = "GameOverWin"
        this.winner = winner;
    }
}

