import { generatePieceVariations } from './utils/newPuzzleSolver';
import { PIECE_SHAPES } from './data/pieceShapes';

// Test all permutations of the Light Orange piece
function testLightOrangePermutations() {
  console.log('=== TESTING LIGHT ORANGE PIECE PERMUTATIONS ===\n');
  
  const lightOrangePiece = PIECE_SHAPES.find(p => p.id === 3);
  if (!lightOrangePiece) {
    console.log('Light Orange piece not found!');
    return;
  }
  
  console.log('Original Light Orange piece:');
  lightOrangePiece.shape.forEach(row => {
    console.log(row.map(cell => cell ? 'x' : '0').join(' '));
  });
  
  console.log('\n=== ALL PERMUTATIONS ===');
  const variations = generatePieceVariations(lightOrangePiece);
  
  variations.forEach((variation, index) => {
    console.log(`\nPermutation ${index + 1}:`);
    console.log(`Rotation: ${variation.rotation * 90}°`);
    console.log(`Flipped: ${variation.flipped}`);
    console.log('Shape:');
    variation.shape.forEach(row => {
      console.log(row.map(cell => cell ? 'x' : '0').join(' '));
    });
    
    // Count filled squares
    const filledSquares = variation.shape.reduce((sum, row) => 
      sum + row.reduce((a, b) => a + b, 0), 0);
    console.log(`Filled squares: ${filledSquares}`);
  });
  
  console.log(`\nTotal permutations: ${variations.length}`);
  console.log('Expected: 8 permutations (4 rotations × 2 flip states)');
}

testLightOrangePermutations(); 