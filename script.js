
const screenController = (
    function(){
        // Dependencies 
        gameController = GameController();

        const boardDiv = document.querySelector("#board");
        const gameStatusDiv = document.querySelector("#game-status");
        console.dir(gameStatusDiv);

        // Populate the board with buttons
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col<3; col++) {
                const button = document.createElement("button");
                button.classList.add("btn");
                button.dataset.row = row;
                button.dataset.col = col;
                boardDiv.appendChild(button);
            }
            
        }
        const boxClickHandler = (e) => {
            gameController.playRound(e.target.dataset.row, e.target.dataset.col)
        }
        // Attach event listener to track clicks on the buttons
        boardDiv.addEventListener("click", boxClickHandler)
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
    const getCurrentPlayer = ()=>currentPlayer;
    
    // public methods 
    const playRound = (row, col) => {
        board.markBox(row, col, currentPlayer);
        switchPlayer();
    }

    // private methods
    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    } 

    return {playRound}
}

function Board(){
    // props 
    const board = [];

    // Populating the board
    for (let row = 0; row < 3; row++){
        board[row] = [];
        for (let col = 0; col < 3; col++){
            board[row][col] = ''
        }
    }

    // public methods 
    const markBox = (row, col, player) => {
        board[row][col] = player.getSymbol();
        console.dir(board)
    }

    return {markBox}
}

function Player(name, symbol) {    
    // getters
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol};
    
}