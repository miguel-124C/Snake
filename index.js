//HTML elements
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");
const buttonBackGame = document.querySelector('.backGame')
const buttonRetry = document.querySelector('.retry');
const buttonExit = document.querySelector('.exit');
//game settings
const boardSize = 10;
let gameSpeed;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
    headSnake:3
};
const directions = {
    ArrowUp:-10,
    ArrowDown: 10,
    ArrowRight:1,
    ArrowLeft:-1
}
//Game Vaiables
let snake;
let score;
var varScore;
let varTime = 50;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake=()=>{
    snake.forEach(square =>{
        drawSquare(square, 'snakeSquare');
    });
} 

const drawSquare = (square,type)=>{
    const [ row, column ] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);
    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = ()=>{
    const newSquare = String(
            Number(snake[snake.length-1])+directions[direction])
            .padStart(2,'0');
    const [ row,column] = newSquare.split('');
        console.log(newSquare);
    if(newSquare < 0 || 
        newSquare > boardSize * boardSize || 
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9 ||
        boardSquares[row][column] === squareTypes.snakeSquare)){
        gameOver();
    }else{
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.foodSquare){
            addFood();
        }else{
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }drawSnake(); 
    }
}

const addFood=()=>{
    score++;
    console.log(varScore);
    console.log(varTime);
    updateScore();
    createRandomFood();
    console.log("comiste una manzana");
    if(score == varScore){
        gameSpeed-=varTime;
        console.log("cambia velocidad");
        clearInterval(moveInterval);
        moveInterval = setInterval(()=>moveSnake(),gameSpeed);
        varScore+=10;
        console.log('va a ua velocidad de: '+gameSpeed);
    }
    
}

const gameOver =()=>{
    console.log(gameSpeed);
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
    gameOverSign.addEventListener('click',()=>{
        gameOverSign.style.display = 'none';
    });
}

const setDirection = (newDirection)=> {
    direction = newDirection;
}

const directionEvent =(key)=>{
    switch (key.code) {
        case 'ArrowUp':
            if(direction != 'ArrowDown'){
                setDirection(key.code)
            } 
            break;
        case 'ArrowDown':
            if(direction != 'ArrowUp') setDirection(key.code)
            break;
        case 'ArrowRight':
            if(direction != 'ArrowLeft') setDirection(key.code)
            break;
        case 'ArrowLeft':
            if(direction != 'ArrowRight') setDirection(key.code)
            break;    
    }
}

const createRandomFood=()=>{
    const randomEmptySquare = emptySquares[Math.floor(Math.random()*emptySquares.length)]
    drawSquare(randomEmptySquare,'foodSquare');
}

const updateScore = ()=>{
    scoreBoard.textContent = 'Score: '+score;
 
}

const createBoard = ()=>{
    boardSquares.forEach((row,rowIndex) => {
        row.forEach((column,columnIndex)=>{
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('DIV');
            squareElement.setAttribute('class','square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    });
}

const setGame=()=>{
    snake = ['00','01','02','03'];
    score = snake.length;
    gameSpeed = 400;
    varScore = 10;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize),()=> new Array(boardSize).fill(squareTypes.emptySquare))
    console.log(boardSquares);
    board.innerHTML = "";
    emptySquares = [];
    createBoard();
}


const startGame=()=>{
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    addEventListener('keydown',directionEvent);
    moveInterval = setInterval(()=>moveSnake(),gameSpeed);
}

const backGame=()=>{
    moveInterval = setInterval(()=>moveSnake(),gameSpeed);
    document.querySelector('.pause').style.display = 'none';
}

const retry =()=>{
    startGame();
    document.querySelector('.pause').style.display = 'none';
}

startButton.addEventListener("click",startGame);
buttonBackGame.addEventListener('click',backGame);
buttonRetry.addEventListener('click',retry);
buttonExit.addEventListener('click',()=>{
    confirm('Seguro');
});

document.addEventListener("keydown",(e)=>{
    if(e.key == 'Escape'){
        e.preventDefault();
        document.querySelector('.pause').style.display = 'block';
        clearTimeout(moveInterval);    
    }
});