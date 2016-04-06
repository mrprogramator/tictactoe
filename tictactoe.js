var util = require('util');
var tree = [];

EMPTY = " ";

STATES = {
    TIGHT : 0,
    WINNER : 1,
    PLAYING : 2
}

PLAYERS = [4,5]

function cleanTable(table) {
    for(var i=0; i<9; ++i) {
        table.push(EMPTY);
    }
}

function checkWinner(player, table) {
    if (
        (table[0] === table[1] && table[1] === table[2] && table[0] === player)
        || (table[3] === table[4] && table[4] === table[5] && table[3] === player)
        || (table[6] === table[7] && table[7] === table[8] && table[6] === player)
        || (table[0] === table[4] && table[4] === table[8] && table[0] === player)
        || (table[2] === table[4] && table[4] === table[6] && table[2] === player)
        || (table[0] === table[3] && table[3] === table[6] && table[0] === player)
        || (table[1] === table[4] && table[4] === table[7] && table[1] === player)
        || (table[2] === table[5] && table[5] === table[8] && table[2] === player)
        ) {
            return true;
        }
        return false;
}

function isTight(table) {
    return table.indexOf(EMPTY) < 0;
}

function getGameState(table) {
    for(var i = 0; i< 2; ++i) {
        if (checkWinner(PLAYERS[i], table)) {
            return {
                status: STATES['WINNER'],
                player: PLAYERS[i]
            }
        }
    }
    if (isTight(table)) {
        return { status: STATES['TIGHT'] }
    }
    return { status: STATES['PLAYING'] }
}

function getWinner(table) {
    return 
}

function printTable(table) {
    for(var i=0; i<9; i+=3) {
        var row = "";
        for(var j=0; j < 3; j++){
            if (isEmpty(table[i+j])) {
                row += (i+j);
            }
            else {
                row += table[i+j];
            }
            row += "\t";
        }
        console.log(row,'\n');
    }
}

function isEmpty(item) {
    return (item === EMPTY);
}

function play(position, symbol, table){
    if (!isEmpty(table[position])) {
        return false;
    }
    table[position] = symbol
    return true;
}

function playGame(player, table, singlePlayer, noPlayer, answer) {
    printTable(table);
    if ((singlePlayer && noPlayer) || (singlePlayer && !noPlayer && player===PLAYERS[1])) {
        answer = chooseMove(table, player);
        console.log('PC', player,'plays',answer);
        if (play(answer, player, table)) {
                player = getNextPlayer(player);
            }
        else {
            console.log('position is not empty',answer);
            return;
        }
        var gameState = getGameState(table);
        if (gameState['status'] === STATES['WINNER']) {
            printTable(table);
            console.log(gameState['player'] + "  W I N S ! ! !");
            return gameState;
        }

        else if (gameState['status'] === STATES['TIGHT']) {
            printTable(table);
            console.log('T I G H T');
            return gameState;
        }

        else {
            //playGame(player, table, singlePlayer, noPlayer);
            return gameState;
        }
    }
    else{
            if (play(answer, player, table)) {
                player = getNextPlayer(player);
            }
            else {
                console.log('position is not empty');
            }
            
            var gameState = getGameState(table);
            if (gameState['status'] === STATES['WINNER']) {
                printTable(table);
                console.log(gameState['player'] + "  W I N S ! ! !");
                return gameState;
            }

            else if (gameState['status'] === STATES['TIGHT']) {
                printTable(table);
                console.log('T I G H T');
                return gameState;
            }

            else {
                //playGame(player, table, singlePlayer, noPlayer);
                return gameState;
            }
    }
}

function printTree(tree){
    
    tree.forEach(function (branch) {
        printTable(branch.table);
        console.log(branch.move);
        console.log(branch.status);
        console.log('CHILDREN')
        console.log('[');
        printTree(branch.children);
        console.log(']');
    })
}

function finish() {
    console.log('File saved!');
}

function startGame(player, singlePlayer, noPlayer) {
    
    var table = [];
    cleanTable(table);
    playGame(player, table, singlePlayer,noPlayer)
}

apiPlayGame = function (player, position, singlePlayer, noPlayer, table){
    if (table && table.length === 0){
        cleanTable(table);
    }
    
    if(!table){
        return {table :['table is null']}
    }
    
    var gameState = playGame(PLAYERS[player], table, singlePlayer, noPlayer, position);
    
    if (gameState.status === STATES['PLAYING'] && singlePlayer){
        var gameState = playGame(getNextPlayer(PLAYERS[player]), table, singlePlayer, noPlayer, position);
    }
    
    
    return {
        player:player, 
        position: position, 
        singlePlayer: singlePlayer, 
        noPlayer: noPlayer, 
        table: table,
        gameState: gameState
    };
}


function chooseMove(table, player){
    var tree = fillTree(table, player);
    
    tree.forEach(function (branch){
        branch.weight = getWeight(branch, player);
    });
    
    var weights = [];
    tree.forEach(function (branch) {
        branch.weight.forEach(function (w) {
            w.move = branch.move.position;
            weights.push(w);
        })
    });
    console.log(weights);
    var min = 999999999999999999999;
    var move = null;
    
    weights.forEach(function (w){
        if (w.level < min){
            if (w['player'] === player){
                min = w.level;
                move = w.move;
                wMove = w;
                console.log('move to win',move);
            }
            else if (!w['player']){
                min = w.level;
                move = w.move;
                wMove = w;
                console.log('move to tight',move);
            }
        }
        
    })
    
    
    if (move === null) {
        var max = -1;
        weights.forEach(function (w){
            if (w.level > max){
                if (w['player'] && w['player'] != player) {
                    max = w.level;
                    move = w.move;
                    wMove = w;
                console.log('move to loose',move);
                }
            }
        })
        if (move === null){
            console.log('move not found :(');
            move = weights[0].move;
        }
    }
    
    moves = weights.filter(function (w) {
        return w['player'] === wMove.player && w['level'] === wMove.level;
    })
    
    if (moves.length > 1){
        var rand = Math.round(Math.random()*(moves.length-1));
        console.log('more than one posible move found',rand);
        move = moves[rand].move;
    }
    
    return move;
}


function getNextPlayer(player){
    var nextPlayer;
    player === PLAYERS[0] ? nextPlayer = PLAYERS[1]: nextPlayer = PLAYERS[0];
    return nextPlayer;
}

function getWeight (branch, player) {
    var weights = branch.weight;
    branch.children.forEach(function (child) {
        if (!child.weight || child.weight.length === 0) {
            child.weight = getWeight(child);
        }
        child.weight.forEach(function (w) {
            weights.push(w);
        })
    })
    
    var min = weights[0].level;
    var max = weights[0].level;
    
    var jugada = weights[0];
    
    weights.forEach(function (weight) {
        if (weight['level'] < min){
                min = weight.level;
                jugada = weight;
        }
    });
    
    return [jugada];
}



function fillTree(table, player, level, tree) {
    if (tree == undefined) {
        tree = [];
    }
    
    if (level == undefined) {
        level = 0;
    }
    else{
        ++level;
    }
    
    for(var i = 0; i< 9; ++i) {
        if (isEmpty(table[i])) {
            var newTable = table.slice();
            play(i, player, newTable);
            
            var branch = {
                table: newTable,
                move: {
                    player: player,
                    position: i
                },
                status: getGameState(newTable),
                children: [],
                weight: []
            }
            
            
            if (branch.status['status'] == STATES['PLAYING']) {
                var nextPlayer = getNextPlayer(player);
                branch.children = fillTree(newTable, nextPlayer,level);
            }
            else if(branch.status['status'] == STATES['WINNER']
                || branch.status['status'] == STATES['TIGHT'])
            {
                branch.weight.push({
                    status: branch.status['status'],
                    player: branch.status['player'],
                    level: level
                })
            }
            
            tree.push(branch);
            
        }
    }
    
    return tree;
}
