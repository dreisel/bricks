import { solvePuzzle } from './utils/newPuzzleSolver';
import { getPiecesByIds, getTotalArea } from './data/pieceShapes';

// Test pieces (White, Yellow, Brown, Orange, Light Blue, Black)
const testPieceIds = [1, 2, 5, 6, 10, 11]; // White, Yellow, Brown, Orange, Light Blue, Black
const testPieces = getPiecesByIds(testPieceIds);

function runNewTest() {
  console.log('🧩 Testing New Puzzle Solver Algorithm');
  console.log('=====================================');
  
  const boardWidth = 6;
  const boardHeight = 5;
  const boardArea = boardWidth * boardHeight;
  
  console.log(`Board size: ${boardHeight} × ${boardWidth} = ${boardArea} squares`);
  
  // Calculate total area of pieces
  const totalArea = getTotalArea(testPieces);
  console.log(`Total piece area: ${totalArea} squares`);
  
  // Verify pieces can fill the board
  if (totalArea !== boardArea) {
    console.error(`❌ Area mismatch! Pieces: ${totalArea}, Board: ${boardArea}`);
    return;
  }
  
  console.log('✅ Area validation passed');
  
  // Show piece details
  console.log('\nPiece details:');
  testPieces.forEach(piece => {
    const area = piece.shape.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0);
    console.log(`${piece.name}: ${area} squares`);
  });
  
  // Run the new solver
  console.log('\n🔍 Starting new puzzle solver...');
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
runNewTest(); 