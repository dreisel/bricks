import { solvePuzzle } from './utils/puzzleSolver';
import { getPiecesByIds } from './data/pieceShapes';

// Test with just 2 pieces on a 2x5 board
const testPieceIds = [1, 2]; // White and Yellow
const testPieces = getPiecesByIds(testPieceIds);

function runSimpleTest() {
  console.log('🧩 Simple Puzzle Solver Test');
  console.log('=============================');
  
  const boardWidth = 2;
  const boardHeight = 5;
  const boardArea = boardWidth * boardHeight;
  
  console.log(`Board size: ${boardHeight} × ${boardWidth} = ${boardArea} squares`);
  
  // Calculate total area of pieces
  const totalArea = testPieces.reduce((sum, piece) => {
    return sum + piece.shape.reduce((rowSum, row) => {
      return rowSum + row.reduce((cellSum, cell) => cellSum + cell, 0);
    }, 0);
  }, 0);
  
  console.log(`Total piece area: ${totalArea} squares`);
  
  // Show piece details
  console.log('\nPiece details:');
  testPieces.forEach(piece => {
    const area = piece.shape.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0);
    console.log(`${piece.name}: ${area} squares`);
  });
  
  // Run the solver
  console.log('\n🔍 Starting simple puzzle solver...');
  const startTime = Date.now();
  
  try {
    const solutions = solvePuzzle(testPieces, boardWidth, boardHeight);
    const endTime = Date.now();
    
    console.log(`\n⏱️  Solver completed in ${endTime - startTime}ms`);
    console.log(`📊 Found ${solutions.length} solution(s)`);
    
    if (solutions.length > 0) {
      console.log('\n✅ SUCCESS! Solutions found:');
      solutions.forEach((solution, index) => {
        console.log(`\nSolution ${index + 1}:`);
        solution.forEach(placement => {
          const piece = testPieces.find(p => p.id === placement.pieceId);
          console.log(`  ${piece?.name} at (${placement.x}, ${placement.y}) - Rotation: ${placement.rotation}, Flipped: ${placement.flipped}`);
        });
      });
    } else {
      console.log('\n❌ No solutions found');
    }
    
  } catch (error) {
    console.error('❌ Error during solving:', error);
  }
}

// Run the test
runSimpleTest(); 