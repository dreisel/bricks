import { PIECE_SHAPES } from './data/pieceShapes';

console.log('=== CHECKING PIECE AREAS ===\n');

PIECE_SHAPES.forEach(piece => {
  const area = piece.shape.reduce((sum, row) => 
    sum + row.reduce((a, b) => a + b, 0), 0);
  
  console.log(`${piece.name}: ${area} squares`);
  console.log('Shape:');
  piece.shape.forEach(row => {
    console.log(row.map(cell => cell ? 'x' : '0').join(' '));
  });
  console.log('');
});

const totalArea = PIECE_SHAPES.reduce((sum, piece) => 
  sum + piece.shape.reduce((rowSum, row) => 
    rowSum + row.reduce((cellSum, cell) => cellSum + cell, 0), 0), 0);

console.log(`Total area of all pieces: ${totalArea} squares`); 