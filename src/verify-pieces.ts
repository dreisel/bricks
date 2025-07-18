import { PIECE_SHAPES, getPieceArea } from './data/pieceShapes';

function printPiece(piece: any) {
  console.log(`${piece.name} (${getPieceArea(piece)} squares):`);
  piece.shape.forEach((row: number[]) => {
    console.log('  ' + row.map(cell => cell ? '█' : '·').join(''));
  });
  console.log('');
}

function verifyPieces() {
  console.log('🔍 Verifying Piece Shapes');
  console.log('========================');
  
  PIECE_SHAPES.forEach(piece => {
    printPiece(piece);
  });
  
  // Test a simple placement
  console.log('🧪 Testing Simple Placement');
  console.log('===========================');
  
  const board = Array(5).fill(null).map(() => Array(6).fill(0));
  
  // Try placing the White piece at (0,0)
  const whitePiece = PIECE_SHAPES.find(p => p.id === 1);
  if (whitePiece) {
    console.log('Placing White piece at (0,0):');
    whitePiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          board[y][x] = 1;
        }
      });
    });
    
    // Print the board
    console.log('Board after placing White piece:');
    board.forEach(row => {
      console.log('  ' + row.map(cell => cell ? '█' : '·').join(''));
    });
  }
}

verifyPieces(); 