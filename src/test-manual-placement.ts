import { generatePieceVariations } from './utils/newPuzzleSolver';
import { PIECE_SHAPES } from './data/pieceShapes';

// Test manual placement of pieces
function testManualPlacement() {
  console.log('=== TESTING MANUAL PLACEMENT ===\n');
  
  // Test with White piece on 2x5 board
  const whitePiece = PIECE_SHAPES.find(p => p.id === 1);
  const boardWidth = 2;
  const boardHeight = 5;
  
  console.log(`Testing White piece on ${boardWidth}x${boardHeight} board`);
  console.log('White piece shape:');
  whitePiece!.shape.forEach(row => {
    console.log(row.map(cell => cell ? 'x' : '0').join(' '));
  });
  
  // Check if piece fits at (0,0)
  const shape = whitePiece!.shape;
  const shapeRows = shape.length;
  const shapeCols = shape[0].length;
  
  console.log(`\nPiece dimensions: ${shapeRows}x${shapeCols}`);
  console.log(`Board dimensions: ${boardHeight}x${boardWidth}`);
  
  // Check if piece fits within boundaries
  const fitsInBoundaries = shapeRows <= boardHeight && shapeCols <= boardWidth;
  console.log(`Fits in boundaries: ${fitsInBoundaries}`);
  
  if (fitsInBoundaries) {
    // Try to place the piece
    const board = Array(boardHeight).fill(null).map(() => Array(boardWidth).fill(0));
    
    console.log('\nPlacing piece at (0,0):');
    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell && 0 + dy < boardHeight && 0 + dx < boardWidth) {
          board[0 + dy][0 + dx] = 1;
          console.log(`Placing at (${0 + dx}, ${0 + dy})`);
        }
      });
    });
    
    console.log('\nBoard after placement:');
    board.forEach((row, y) => {
      const rowStr = row.map(cell => cell === 0 ? '0' : 'W').join(' ');
      console.log(`Row ${y}: ${rowStr}`);
    });
  }
  
  // Test all variations
  console.log('\n=== TESTING ALL VARIATIONS ===');
  const variations = generatePieceVariations(whitePiece!);
  
  variations.forEach((variation, index) => {
    console.log(`\nVariation ${index + 1}:`);
    console.log(`Rotation: ${variation.rotation * 90}°, Flipped: ${variation.flipped}`);
    variation.shape.forEach(row => {
      console.log(row.map(cell => cell ? 'x' : '0').join(' '));
    });
    
    // Check if this variation fits
    const varRows = variation.shape.length;
    const varCols = variation.shape[0].length;
    const fits = varRows <= boardHeight && varCols <= boardWidth;
    console.log(`Fits on board: ${fits} (${varRows}x${varCols})`);
  });
}

testManualPlacement(); 