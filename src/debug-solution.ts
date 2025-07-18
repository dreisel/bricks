import { solvePuzzle, generatePieceVariations } from './utils/newPuzzleSolver';
import { PIECE_SHAPES, getPiecesByIds } from './data/pieceShapes';

// Test the specific combination that was causing issues
const testPieces = getPiecesByIds([1, 2, 5, 6, 10, 11]); // White, Yellow, Brown, Orange, Light Blue, Black
const boardWidth = 6;

console.log('=== DEBUGGING SOLUTION ===');
console.log(`Testing pieces: ${testPieces.map(p => p.name).join(', ')}`);
console.log(`Board size: ${boardWidth}x5`);

// Calculate total area
const totalArea = testPieces.reduce((sum, piece) => {
  const area = piece.shape.reduce((rowSum, row) => rowSum + row.reduce((cellSum, cell) => cellSum + cell, 0), 0);
  console.log(`${piece.name}: ${area} squares`);
  return sum + area;
}, 0);

console.log(`Total area: ${totalArea} squares`);
console.log(`Board area: ${boardWidth * 5} squares`);
console.log(`Area match: ${totalArea === boardWidth * 5 ? 'YES' : 'NO'}`);

// Run the solver
const solutions = solvePuzzle(testPieces, boardWidth);

if (solutions.length > 0) {
  console.log(`\nFound ${solutions.length} solution(s)`);
  
  // Analyze the first solution
  const solution = solutions[0];
  console.log('\n=== SOLUTION ANALYSIS ===');
  
  // Create a board to visualize the solution
  const board = Array(5).fill(null).map(() => Array(boardWidth).fill(0));
  
  solution.forEach((placement, index) => {
    const piece = testPieces.find(p => p.id === placement.pieceId);
    if (piece) {
      console.log(`\nPiece ${index + 1}: ${piece.name}`);
      console.log(`Position: (${placement.x}, ${placement.y})`);
      console.log(`Rotation: ${placement.rotation * 90}°`);
      console.log(`Flipped: ${placement.flipped}`);
      
      // Get the actual shape used
      const variations = generatePieceVariations(piece);
      const variation = variations.find(v => 
        v.rotation === placement.rotation && v.flipped === placement.flipped
      );
      
      if (variation) {
        console.log('Shape used:');
        variation.shape.forEach(row => {
          console.log(row.map(cell => cell ? 'x' : '0').join(' '));
        });
        
        // Place on board
        variation.shape.forEach((row, dy) => {
          row.forEach((cell, dx) => {
            if (cell && placement.y + dy < 5 && placement.x + dx < boardWidth) {
              board[placement.y + dy][placement.x + dx] = piece.id;
            }
          });
        });
      }
    }
  });
  
  // Display the final board
  console.log('\n=== FINAL BOARD ===');
  board.forEach((row, y) => {
    const rowStr = row.map(cell => {
      if (cell === 0) return '0';
      const piece = testPieces.find(p => p.id === cell);
      return piece ? piece.name.charAt(0).toUpperCase() : '?';
    }).join(' ');
    console.log(`Row ${y}: ${rowStr}`);
  });
  
  // Check for empty spaces
  const emptyCount = board.flat().filter(cell => cell === 0).length;
  console.log(`\nEmpty spaces: ${emptyCount}`);
  
  // Check for overlaps
  const pieceCounts = new Map<number, number>();
  board.flat().forEach(cell => {
    if (cell !== 0) {
      pieceCounts.set(cell, (pieceCounts.get(cell) || 0) + 1);
    }
  });
  
  console.log('\nPiece counts:');
  pieceCounts.forEach((count, pieceId) => {
    const piece = testPieces.find(p => p.id === pieceId);
    const expectedArea = piece ? piece.shape.reduce((sum, row) => 
      sum + row.reduce((a, b) => a + b, 0), 0) : 0;
    console.log(`${piece?.name}: ${count} squares (expected: ${expectedArea})`);
  });
  
} else {
  console.log('No solutions found');
} 