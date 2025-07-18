// Utility functions for puzzle solving

export interface Piece {
  id: number;
  name: string;
  color: string;
  shape: number[][];
}

export interface Solution {
  pieceId: number;
  x: number;
  y: number;
  rotation: number;
  flipped: boolean;
}

export interface PieceVariation {
  pieceId: number;
  shape: number[][];
  rotation: number;
  flipped: boolean;
}

// Generate all possible variations of a piece (rotations and flips)
export function generatePieceVariations(piece: Piece): PieceVariation[] {
  const variations: PieceVariation[] = [];
  
  // Original piece
  variations.push({
    pieceId: piece.id,
    shape: piece.shape,
    rotation: 0,
    flipped: false
  });
  
  // Rotated versions (90°, 180°, 270°)
  let rotatedShape = piece.shape;
  for (let rotation = 1; rotation <= 3; rotation++) {
    rotatedShape = rotateMatrix(rotatedShape);
    variations.push({
      pieceId: piece.id,
      shape: rotatedShape,
      rotation,
      flipped: false
    });
  }
  
  // Flipped versions
  const flippedShape = flipMatrix(piece.shape);
  variations.push({
    pieceId: piece.id,
    shape: flippedShape,
    rotation: 0,
    flipped: true
  });
  
  // Flipped and rotated versions
  let flippedRotatedShape = flippedShape;
  for (let rotation = 1; rotation <= 3; rotation++) {
    flippedRotatedShape = rotateMatrix(flippedRotatedShape);
    variations.push({
      pieceId: piece.id,
      shape: flippedRotatedShape,
      rotation,
      flipped: true
    });
  }
  
  return variations;
}

// Rotate a matrix 90 degrees clockwise
function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = matrix[i][j];
    }
  }
  
  return rotated;
}

// Flip a matrix horizontally
function flipMatrix(matrix: number[][]): number[][] {
  return matrix.map(row => [...row].reverse());
}

// Check if a piece can be placed at a specific position
export function canPlacePiece(
  board: number[][],
  pieceShape: number[][],
  x: number,
  y: number
): boolean {
  const rows = pieceShape.length;
  const cols = pieceShape[0].length;
  
  // Check if piece fits within board boundaries
  if (y + rows > board.length || x + cols > board[0].length) {
    return false;
  }
  
  // Check if piece overlaps with existing pieces
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (pieceShape[i][j] && board[y + i][x + j] !== 0) {
        return false;
      }
    }
  }
  
  return true;
}

// Place a piece on the board
export function placePiece(
  board: number[][],
  pieceShape: number[][],
  pieceId: number,
  x: number,
  y: number
): void {
  const rows = pieceShape.length;
  const cols = pieceShape[0].length;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (pieceShape[i][j]) {
        board[y + i][x + j] = pieceId;
      }
    }
  }
}

// Remove a piece from the board
export function removePiece(
  board: number[][],
  pieceShape: number[][],
  x: number,
  y: number
): void {
  const rows = pieceShape.length;
  const cols = pieceShape[0].length;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (pieceShape[i][j]) {
        board[y + i][x + j] = 0;
      }
    }
  }
}

// Find the next empty position on the board
export function findNextEmptyPosition(board: number[][]): [number, number] | null {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (board[y][x] === 0) {
        return [x, y];
      }
    }
  }
  return null;
}

// Main solving function using backtracking
export function solvePuzzle(
  pieces: Piece[],
  boardWidth: number,
  boardHeight: number = 5
): Solution[][] {
  const solutions: Solution[][] = [];
  const board = Array(boardHeight).fill(null).map(() => Array(boardWidth).fill(0));
  
  // Create a map of piece variations by piece ID
  const variationsByPiece: Map<number, PieceVariation[]> = new Map();
  pieces.forEach(piece => {
    variationsByPiece.set(piece.id, generatePieceVariations(piece));
  });
  
  // Track used pieces to ensure each piece is used exactly once
  const usedPieces = new Set<number>();
  
  // Track current solution being built
  const currentSolution: Solution[] = [];
  
  let attempts = 0;
  
  function backtrack(): void {
    attempts++;
    if (attempts % 10000 === 0) {
      console.log(`Backtrack attempts: ${attempts}, Solutions found: ${solutions.length}`);
    }
    
    // Check if board is completely filled
    const emptyPos = findNextEmptyPosition(board);
    if (!emptyPos) {
      // Board is filled - we found a solution!
      console.log('Found solution!', currentSolution);
      solutions.push([...currentSolution]);
      return;
    }
    
    const [startX, startY] = emptyPos;
    
    // Try each piece
    for (const piece of pieces) {
      if (usedPieces.has(piece.id)) continue;
      
      // Try each variation of this piece
      const variations = variationsByPiece.get(piece.id) || [];
      for (const variation of variations) {
        // Try placing this variation at the empty position
        if (canPlacePiece(board, variation.shape, startX, startY)) {
          // Place the piece
          placePiece(board, variation.shape, piece.id, startX, startY);
          usedPieces.add(piece.id);
          
          // Add to current solution
          currentSolution.push({
            pieceId: piece.id,
            x: startX,
            y: startY,
            rotation: variation.rotation,
            flipped: variation.flipped
          });
          
          // Recursively try to fill the rest of the board
          backtrack();
          
          // Backtrack: remove the piece
          removePiece(board, variation.shape, startX, startY);
          usedPieces.delete(piece.id);
          currentSolution.pop();
        }
      }
    }
  }
  
  // Start the backtracking algorithm
  console.log(`Starting solver with ${pieces.length} pieces, board size: ${boardWidth}x${boardHeight}`);
  backtrack();
  console.log(`Solver finished. Total attempts: ${attempts}, Solutions found: ${solutions.length}`);
  
  return solutions;
}

// Calculate the total area of selected pieces
export function calculateTotalArea(pieces: Piece[]): number {
  return pieces.reduce((total, piece) => {
    return total + piece.shape.reduce((rowSum, row) => {
      return rowSum + row.reduce((cellSum, cell) => cellSum + cell, 0);
    }, 0);
  }, 0);
}

// Check if the selected pieces can potentially fill the board
export function canPiecesFillBoard(pieces: Piece[], boardWidth: number, boardHeight: number = 5): boolean {
  const totalArea = calculateTotalArea(pieces);
  const boardArea = boardWidth * boardHeight;
  return totalArea === boardArea;
} 