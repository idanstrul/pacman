'use strict'
const WALL = '#'
const FOOD = '.'
const POWERFOOD = '⨂'
const EMPTY = ' ';
const CHERRY = '🍒';

var gBoard;
var gGame = {
    score: 0,
    isOn: false
}
var gTotalFood;
var gIntervalCherry;

function init() {
    // console.log('Hello')
    gTotalFood = 0;
    updateScore(-gGame.score)
    gBoard = buildBoard()
    createPacman(gBoard);
    createGhosts(gBoard);
    // console.table(gBoard)
    printMat(gBoard, '.board-container')
    gGame.isOn = true;
    document.querySelector('.modal').style.display = 'none';
    gIntervalCherry = setInterval(addCheery, 15000);
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
            } else if ((i === 1 && j === 1) || (i === 1 && j === SIZE - 2)
                || (i === SIZE - 2 && j === 1) || (i === SIZE - 2 && j === SIZE - 2)) {
                board[i][j] = POWERFOOD;
            } else {
                board[i][j] = FOOD;
                gTotalFood++;
            }
        }
    }
    return board;
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;
}

function endGame() {
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(gIntervalCherry);

    var isWinner = gGame.score >= gTotalFood;
    if (!isWinner) {
        // update the model
        gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
        // update the DOM
        renderCell(gPacman.location, EMPTY)
    }

    document.querySelector('.modal h2').innerText = (!isWinner) ? 'Game Over!' : 'You Won!';
    document.querySelector('.modal').style.display = 'block';
}

function addCheery(){
    var location = getRndEmptyCellLocation(gBoard,  ' ');
    if (!location) return;
    gBoard[location.i][location.j] = CHERRY;
    renderCell(location, CHERRY);
}
