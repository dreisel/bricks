import { solvePuzzle } from './utils/newPuzzleSolver';
import { PIECE_SHAPES, getPiecesByIds } from './data/pieceShapes';

// Test with a simple 3-piece combination
function testSimpleSolver() {
  console.log('=== TESTING SIMPLE SOLVER ===\n');
  
  // Test with White, Yellow, and Brown pieces on a 3x5 board
  const testPieces = getPiecesByIds([1, 2, 5]); // White, Yellow, Brown
  const boardWidth = 3;
  
  console.log(`Testing with ${testPieces.length} pieces on ${boardWidth}x5 board`);
  
  // Calculate areas
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
  console.log(`Area match: ${totalArea === boardWidth * 5 ? 'YES' : 'NO'}`);
  
  // Run solver
  const solutions = solvePuzzle(testPieces, boardWidth);
  
  if (solutions.length > 0) {
    console.log(`\nFound ${solutions.length} solution(s)`);
    
    solutions.forEach((solution, index) => {
      console.log(`\nSolution ${index + 1}:`);
      solution.forEach(placement => {
        const piece = testPieces.find(p => p.id === placement.pieceId);
        console.log(`${piece?.name}: (${placement.x}, ${placement.y}), Rotation: ${placement.rotation * 90}°, Flipped: ${placement.flipped}`);
      });
    });
  } else {
    console.log('\nNo solutions found');
  }
}

testSimpleSolver(); 