import { PIECE_SHAPES } from './data/pieceShapes';

console.log('=== CHECKING IF ALL PIECES ARE SQUARE MATRICES ===\n');

PIECE_SHAPES.forEach(piece => {
  const numRows = piece.shape.length;
  const numCols = Math.max(...piece.shape.map(row => row.length));
  const isSquare = numRows === numCols && piece.shape.every(row => row.length === numCols);
  console.log(`${piece.name}: ${numRows}x${numCols} ${isSquare ? '✅ SQUARE' : '❌ NOT SQUARE'}`);
  piece.shape.forEach(row => {
    console.log(row.map(cell => cell ? 'x' : '0').join(' '));
  });
  console.log('');
}); 