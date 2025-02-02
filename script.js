document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');

    /**
     * Create the Sudoku Grid
     */
    for (let i=0;i<81;i++){
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = '9';
        grid.appendChild(input);
    }

    solveBtn.addEventListener('click', solveSudoku);
    clearBtn.addEventListener('click', clearGrid);
});

function solveSudoku() {
    const grid = document.querySelectorAll('#sudoku-grid input');
    let board = [];
    let row = [];

    /**
     * Convert the Input values of Grid into a 2D array
     */
    grid.forEach((input, index) => {
        row.push(input.value ? input.value : '.');
        if ((index + 1) % 9 === 0) {
            board.push(row);
            row = [];
        }
    });

    /**
     * Validate the grid
     */
    if(!isGridValid(board)){
        alert("NO SOLUTION EXISTS FOR THE ABOVE INPUT");
        return;
    }


    const solvedBoard = solveSudokuHelper(board);
    /**
     * Update the board
     */
    if(solvedBoard){
        grid.forEach((input, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            input.value = solvedBoard[row][col];
        });
    } 
    else{
        alert('No solution exists!');
    }
}

function clearGrid() {
    const grid = document.querySelectorAll('#sudoku-grid input');
    grid.forEach(input => (input.value = ''));
}

function isGridValid(board) {
    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++){
            const num = board[row][col];
            if(num !== '.'){
                board[row][col] = '.';
                if(!isValid(board,row,col,num)){
                    board[row][col] = num;
                    return false;
                }
                board[row][col]= num;
            }
        }
    }
    return true;
}

function solveSudokuHelper(board) {
    const grid = JSON.parse(JSON.stringify(board)); 
    solve(grid);
    return grid;
}

function isValid(board,row,col,num) {
    for (let i = 0; i < 9; i++) {
        /**
         * Check row and column
         */
        if (board[i][col] === num) return false; 
        if (board[row][i] === num) return false; 
    }

    /**
     * Check the 3*3 subgrid
     */
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for(let i=startRow;i<startRow+3;i++){
        for(let j=startCol;j<startCol+3;j++){
            if(board[i][j] === num) return false;
        }
    }
    return true; 
}

function solve(board) {
    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++){
            if(board[row][col] === '.'){
                for(let num=1;num<=9;num++){
                    const charNum = num.toString();
                    if(isValid(board,row,col,charNum)){
                        board[row][col] = charNum;
                        if(solve(board)) return true;
                        board[row][col] = '.'; //Backtrack
                    }
                }
                return false; 
            }
        }
    }
    return true; 
}