import { generatePieceVariations } from './utils/newPuzzleSolver';
import { PIECE_SHAPES } from './data/pieceShapes';

// Test individual piece placement
function testPiecePlacement() {
  console.log('=== TESTING PIECE PLACEMENT ===\n');
  
  // Test with White piece
  const whitePiece = PIECE_SHAPES.find(p => p.id === 1);
  if (whitePiece) {
    console.log('Testing White piece placement:');
    console.log('Original shape:');
    whitePiece.shape.forEach(row => {
      console.log(row.map(cell => cell ? 'x' : '0').join(' '));
    });
    
    const variations = generatePieceVariations(whitePiece);
    console.log(`\nTotal variations: ${variations.length}`);
    
    // Test each variation
    variations.forEach((variation, index) => {
      console.log(`\nVariation ${index + 1}:`);
      console.log(`Rotation: ${variation.rotation * 90}°, Flipped: ${variation.flipped}`);
      variation.shape.forEach(row => {
        console.log(row.map(cell => cell ? 'x' : '0').join(' '));
      });
    });
  }
  
  // Test board placement simulation
  console.log('\n=== TESTING BOARD PLACEMENT ===');
  const board = Array(5).fill(null).map(() => Array(6).fill(0));
  
  // Place White piece at (0,0)
  const whiteVariations = generatePieceVariations(whitePiece!);
  const whiteVariation = whiteVariations[0]; // Original orientation
  
  console.log('Placing White piece at (0,0):');
  whiteVariation.shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell && 0 + dy < 5 && 0 + dx < 6) {
        board[0 + dy][0 + dx] = 1;
        console.log(`Placing at (${0 + dx}, ${0 + dy})`);
      }
    });
  });
  
  console.log('\nBoard after placing White piece:');
  board.forEach((row, y) => {
    const rowStr = row.map(cell => cell === 0 ? '0' : 'W').join(' ');
    console.log(`Row ${y}: ${rowStr}`);
  });
  
  // Count placed squares
  const placedSquares = board.flat().filter(cell => cell !== 0).length;
  const expectedSquares = whitePiece!.shape.reduce((sum, row) => 
    sum + row.reduce((a, b) => a + b, 0), 0);
  
  console.log(`\nPlaced squares: ${placedSquares}`);
  console.log(`Expected squares: ${expectedSquares}`);
  console.log(`Match: ${placedSquares === expectedSquares ? 'YES' : 'NO'}`);
}

testPiecePlacement(); 