import { solvePuzzle, generatePieceVariations } from './utils/newPuzzleSolver';
import { PIECE_SHAPES, getPiecesByIds } from './data/pieceShapes';

// Test the solver logic step by step
function testSolverLogic() {
  console.log('=== TESTING SOLVER LOGIC ===\n');
  
  const testPieces = getPiecesByIds([1, 2, 5, 6, 10, 11]); // White, Yellow, Brown, Orange, Light Blue, Black
  const boardWidth = 6;
  
  console.log(`Testing with ${testPieces.length} pieces on ${boardWidth}x5 board`);
  
  // Calculate expected areas
  testPieces.forEach(piece => {
    const area = piece.shape.reduce((sum, row) => 
      sum + row.reduce((a, b) => a + b, 0), 0);
    console.log(`${piece.name}: ${area} squares`);
  });
  
  const totalArea = testPieces.reduce((sum, piece) => 
    sum + piece.shape.reduce((rowSum, row) => 
      rowSum + row.reduce((cellSum, cell) => cellSum + cell, 0), 0), 0);
  console.log(`Total area: ${totalArea} squares`);
  console.log(`Board area: ${boardWidth * 5} squares`);
  
  // Run solver
  const solutions = solvePuzzle(testPieces, boardWidth);
  
  if (solutions.length > 0) {
    console.log(`\nFound ${solutions.length} solution(s)`);
    
    // Analyze each solution
    solutions.forEach((solution, solutionIndex) => {
      console.log(`\n=== SOLUTION ${solutionIndex + 1} ===`);
      
      // Reconstruct the board step by step
      const board = Array(5).fill(null).map(() => Array(boardWidth).fill(0));
      const pieceCounts = new Map<number, number>();
      
      solution.forEach((placement, stepIndex) => {
        const piece = testPieces.find(p => p.id === placement.pieceId);
        if (piece) {
          console.log(`\nStep ${stepIndex + 1}: Placing ${piece.name} at (${placement.x}, ${placement.y})`);
          console.log(`Rotation: ${placement.rotation * 90}°, Flipped: ${placement.flipped}`);
          
          // Get the shape variation
          const { generatePieceVariations } = require('./utils/newPuzzleSolver');
          const variations = generatePieceVariations(piece);
          const variation = variations.find(v => 
            v.rotation === placement.rotation && v.flipped === placement.flipped
          );
          
          if (variation) {
            console.log('Shape:');
            variation.shape.forEach(row => {
              console.log(row.map(cell => cell ? 'x' : '0').join(' '));
            });
            
            // Place on board
            let placedSquares = 0;
            variation.shape.forEach((row, dy) => {
              row.forEach((cell, dx) => {
                if (cell && placement.y + dy < 5 && placement.x + dx < boardWidth) {
                  board[placement.y + dy][placement.x + dx] = piece.id;
                  placedSquares++;
                }
              });
            });
            
            console.log(`Placed ${placedSquares} squares`);
            pieceCounts.set(piece.id, (pieceCounts.get(piece.id) || 0) + placedSquares);
          }
        }
      });
      
      // Show final board
      console.log('\nFinal board:');
      board.forEach((row, y) => {
        const rowStr = row.map(cell => {
          if (cell === 0) return '0';
          const piece = testPieces.find(p => p.id === cell);
          return piece ? piece.name.charAt(0).toUpperCase() : '?';
        }).join(' ');
        console.log(`Row ${y}: ${rowStr}`);
      });
      
      // Count empty spaces
      const emptyCount = board.flat().filter(cell => cell === 0).length;
      console.log(`\nEmpty spaces: ${emptyCount}`);
      
      // Check piece counts
      console.log('\nPiece counts:');
      pieceCounts.forEach((count, pieceId) => {
        const piece = testPieces.find(p => p.id === pieceId);
        const expectedArea = piece ? piece.shape.reduce((sum, row) => 
          sum + row.reduce((a, b) => a + b, 0), 0) : 0;
        console.log(`${piece?.name}: ${count} squares (expected: ${expectedArea})`);
      });
    });
    
  } else {
    console.log('No solutions found');
  }
}

testSolverLogic(); 