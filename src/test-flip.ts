import { generatePieceVariations, flipMatrix } from './utils/newPuzzleSolver';
import { PIECE_SHAPES } from './data/pieceShapes';

// Helper function to visualize a shape
function visualizeShape(shape: number[][], name: string): void {
  console.log(`\n${name}:`);
  shape.forEach(row => {
    const rowStr = row.map(cell => cell ? 'x' : '0').join(' ');
    console.log(rowStr);
  });
}

// Test flip functionality with specific pieces
function testFlipFunctionality() {
  console.log('=== Testing Flip Functionality ===\n');
  
  // Test with White piece (id: 1)
  const whitePiece = PIECE_SHAPES.find(p => p.id === 1);
  if (whitePiece) {
    console.log('=== WHITE PIECE FLIP EXAMPLE ===');
    visualizeShape(whitePiece.shape, 'Original White Piece');
    
    const variations = generatePieceVariations(whitePiece);
    const flippedVariation = variations.find(v => v.flipped && v.rotation === 0);
    
    if (flippedVariation) {
      visualizeShape(flippedVariation.shape, 'Flipped White Piece (Horizontal)');
    }
  }
  
  // Test with Brown piece (id: 5)
  const brownPiece = PIECE_SHAPES.find(p => p.id === 5);
  if (brownPiece) {
    console.log('\n=== BROWN PIECE FLIP EXAMPLE ===');
    visualizeShape(brownPiece.shape, 'Original Brown Piece');
    
    const variations = generatePieceVariations(brownPiece);
    const flippedVariation = variations.find(v => v.flipped && v.rotation === 0);
    
    if (flippedVariation) {
      visualizeShape(flippedVariation.shape, 'Flipped Brown Piece (Horizontal)');
    }
  }
  
  // Show all variations for a piece
  console.log('\n=== ALL VARIATIONS FOR WHITE PIECE ===');
  const whiteVariations = generatePieceVariations(whitePiece!);
  whiteVariations.forEach((variation, index) => {
    const rotationText = variation.rotation === 0 ? '0°' : `${variation.rotation * 90}°`;
    const flipText = variation.flipped ? ' (Flipped)' : '';
    visualizeShape(variation.shape, `Variation ${index + 1}: ${rotationText}${flipText}`);
  });
  
  console.log(`\nTotal variations for White piece: ${whiteVariations.length}`);
  console.log('Expected: 8 variations (4 rotations × 2 flip states)');
}

// Test the flip matrix function directly
function testFlipMatrixFunction() {
  console.log('\n=== TESTING FLIP MATRIX FUNCTION ===');
  
  // Test with a simple 2x3 matrix
  const testMatrix = [
    [1, 1, 0],
    [0, 1, 1]
  ];
  
  console.log('Original matrix:');
  testMatrix.forEach(row => console.log(row.map(cell => cell ? 'x' : '0').join(' ')));
  
  // Use the imported flip function
  const flippedMatrix = flipMatrix(testMatrix);
  
  console.log('Flipped matrix:');
  flippedMatrix.forEach(row => console.log(row.map(cell => cell ? 'x' : '0').join(' ')));
}

// Run the tests
testFlipFunctionality();
testFlipMatrixFunction(); 