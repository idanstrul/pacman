'use strict'
const GHOST = '&#9781;';
const COLORS = ['white', 'red', 'purple', 'green', 'yellow', 'aqua', 'orange'];
const POWERCOLOR = 'blue';

var gGhosts;
var gDeadGhosts;
var gGhostsId;
var gIntervalGhosts;
// console.log('ghost')

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        id: gGhostsId++,
        color: getRndColor(COLORS) // For non-uniqe ghost colors;
    }
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;

}

function createGhosts(board) {
    gDeadGhosts = [];
    gGhostsId = 101;
    // 3 ghosts and an interval
    gGhosts = [];
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }

    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // console.log('ghost.location', ghost.location)
    // figure out moveDiff, nextLocation, nextCell

    var moveDiff = getMoveDiff()
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j,
    }
    // console.log('nextLocation', nextLocation)

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('nextCell', nextCell)
    // return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    // hitting a pacman?  call gameOver
    if (nextCell === PACMAN) {
        if(gPacman.isSuper){
            killGhost(ghost.location);
        } else {
            endGame();
            return
        }
    }

    // moving from corrent position:
    // update the model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent);
    if (!gGhosts.includes(ghost)) return;

    // Move the ghost to new location
    // update the model
    ghost.location = {
        i: nextLocation.i,
        j: nextLocation.j
    }
    ghost.currCellContent = nextCell
    gBoard[ghost.location.i][ghost.location.j] = GHOST
    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getGhostHTML(ghost) {
    return `<span style="color: ${(gPacman.isSuper) ? POWERCOLOR : ghost.color}">${GHOST}</span>`
}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(1, 100);
    if (randNum <= 25) {
        return { i: 0, j: 1 }
    } else if (randNum <= 50) {
        return { i: -1, j: 0 }
    } else if (randNum <= 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getRndColor(COLORS) {
    var rndIdx = getRandomIntInclusive(0, COLORS.length)
    return COLORS[rndIdx];
}

function killGhost(parLocation) {
    for (var k = 0; k < gGhosts.length; k++) {
        var gstLocation = gGhosts[k].location
        if (gstLocation.i === parLocation.i && gstLocation.j === parLocation.j) {
            var deadGhost = gGhosts.splice(k, 1)[0];
            var elDeadGhostCell = document.querySelector(`td.${getClassName(gstLocation)}`);
            gDeadGhosts.push(deadGhost);
            elDeadGhostCell.classList.add('dead-ghost');
            return deadGhost;
        }
    }
}

function resurrectGhosts() {
    while (gDeadGhosts.length > 0) {
        var currGhost = gDeadGhosts.pop();
        var elCurrGhostCell = document.querySelector(`td.${getClassName(currGhost.location)}`)
        gGhosts.push(currGhost);
        elCurrGhostCell.classList.remove('dead-ghost');
        if (gBoard[currGhost.location.i][currGhost.location.j] === PACMAN) endGame();
    }
    renderAllGhosts();
}

function renderAllGhosts(){
    for (var ghost of gGhosts){
        renderCell(ghost.location, getGhostHTML(ghost));
    }
}
