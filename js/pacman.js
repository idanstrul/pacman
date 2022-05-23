'use strict'
const PACMAN = '😷';

var gPacman;

function createPacman(board) {
    gTotalFood--;
    gPacman = {
        location: {
            i: 5,
            j: 7
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
    if (!gGame.isOn) return
    // use getNextLocation(), nextCell
    var nextLocation = getNextLocation(ev)
    // console.log('nextLocation', nextLocation)
    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('nextCell', nextCell)
    // return if cannot move
    if (nextCell === WALL) return
    // hitting a ghost?  call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            var deadGhost = killGhost(nextLocation);
            if (deadGhost.currCellContent === FOOD){
                updateScore(1);
                deadGhost.currCellContent = EMPTY;
            } else if (deadGhost.currCellContent === CHERRY){
                updateScore(10);
                deadGhost.currCellContent = EMPTY;

            }
        } else {
            endGame();
            return
        }
    }
    if (nextCell === FOOD) {
        updateScore(1);
        if (gGame.score >= gTotalFood) endGame();
    }
    if (nextCell === POWERFOOD) {
        if (gPacman.isSuper) return;
        gPacman.isSuper = true;
        renderAllGhosts();
        setTimeout(function(){gPacman.isSuper = false}, 5000)
        setTimeout(resurrectGhosts, 5000)
    }
    if (nextCell === CHERRY){
        updateScore(10);
        gTotalFood += 10;
        if (gGame.score >= gTotalFood) endGame();
    }

    // moving from corrent position:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // Move the pacman to new location
    // update the model
    gPacman.location = {
        i: nextLocation.i,
        j: nextLocation.j
    }
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    // update the DOM
    renderCell(gPacman.location, PACMAN)
}

function getNextLocation(keyboardEvent) {
    // console.log('keyboardEvent.code', keyboardEvent.code)
    // figure out nextLocation
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }

    switch (keyboardEvent.code) {
        case 'ArrowUp':
            nextLocation.i--
            break;
        case 'ArrowDown':
            nextLocation.i++
            break;
        case 'ArrowLeft':
            nextLocation.j--
            break;
        case 'ArrowRight':
            nextLocation.j++
            break;
        default: return null
    }
    return nextLocation;
}