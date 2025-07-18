import { type PieceShape } from '../data/pieceShapes';

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

// Trim empty rows and columns from a matrix
function trimMatrix(matrix: number[][]): number[][] {
  if (matrix.length === 0) return matrix;
  
  // Find bounds of filled cells
  let minRow = matrix.length, maxRow = -1;
  let minCol = matrix[0].length, maxCol = -1;
  
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) {
        minRow = Math.min(minRow, i);
        maxRow = Math.max(maxRow, i);
        minCol = Math.min(minCol, j);
        maxCol = Math.max(maxCol, j);
      }
    }
  }
  
  // If no filled cells, return original
  if (maxRow < minRow) return matrix;
  
  // Extract the trimmed matrix
  const trimmed: number[][] = [];
  for (let i = minRow; i <= maxRow; i++) {
    const row: number[] = [];
    for (let j = minCol; j <= maxCol; j++) {
      row.push(matrix[i][j]);
    }
    trimmed.push(row);
  }
  
  return trimmed;
}

// Generate all variations of a piece (rotations and flips)
export function generatePieceVariations(piece: PieceShape): PieceVariation[] {
  const variations: PieceVariation[] = [];
  
  // Add original piece
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
  
  // Trim empty rows and columns from all variations
  const trimmedVariations = variations.map(variation => ({
    ...variation,
    shape: trimMatrix(variation.shape)
  }));
  
  // Remove duplicates by comparing trimmed shapes
  const uniqueVariations: PieceVariation[] = [];
  const seenShapes = new Set<string>();
  
  trimmedVariations.forEach(variation => {
    const shapeKey = variation.shape.map(row => row.join('')).join('|');
    if (!seenShapes.has(shapeKey)) {
      seenShapes.add(shapeKey);
      uniqueVariations.push(variation);
    }
  });
  
  return uniqueVariations;
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
export function flipMatrix(matrix: number[][]): number[][] {
  return matrix.map(row => [...row].reverse());
}

// Check if a piece can be placed at a specific position
function canPlacePiece(
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
function placePiece(
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
function removePiece(
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



// Fisher-Yates shuffle function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Main solving function using the new algorithm with optimizations
export function solvePuzzle(
  pieces: PieceShape[],
  boardWidth: number,
  boardHeight: number = 5
): Solution[][] {
  const solutions: Solution[][] = [];
  const board = Array(boardHeight).fill(null).map(() => Array(boardWidth).fill(0));
  
  // Shuffle the pieces to randomize the order
  const shuffledPieces = shuffleArray(pieces);
  
  // Group variations by piece ID
  const variationsByPiece = new Map<number, PieceVariation[]>();
  shuffledPieces.forEach(piece => {
    variationsByPiece.set(piece.id, generatePieceVariations(piece));
  });
  
  // Track used pieces
  const usedPieces = new Set<number>();
  const currentSolution: Solution[] = [];
  
  let attempts = 0;
  
  function backtrack(): boolean {
    attempts++;
    if (attempts % 100000 === 0) {
      console.log(`Attempts: ${attempts}, Used pieces: ${usedPieces.size}/${pieces.length}`);
    }
    
    // If all pieces are used, we found a solution
    if (usedPieces.size === pieces.length) {
      solutions.push([...currentSolution]);
      return true;
    }
    
    // Try each piece that hasn't been used yet (in shuffled order)
    for (const piece of shuffledPieces) {
      if (usedPieces.has(piece.id)) continue;
      
      // Try each variation of this piece
      const variations = variationsByPiece.get(piece.id) || [];
      for (const variation of variations) {
        // Try placing this variation at every position on the board
        const pieceRows = variation.shape.length;
        const pieceCols = variation.shape[0].length;
        
        for (let y = 0; y <= boardHeight - pieceRows; y++) {
          for (let x = 0; x <= boardWidth - pieceCols; x++) {
            // Check if we can place the piece at this position
            if (canPlacePiece(board, variation.shape, x, y)) {
              // Place the piece
              placePiece(board, variation.shape, piece.id, x, y);
              usedPieces.add(piece.id);
              
              // Add to current solution
              currentSolution.push({
                pieceId: piece.id,
                x: x,
                y: y,
                rotation: variation.rotation,
                flipped: variation.flipped
              });
              
              // Recursively try to place remaining pieces
              const success = backtrack();
              
              // Backtrack: remove the piece
              removePiece(board, variation.shape, x, y);
              usedPieces.delete(piece.id);
              currentSolution.pop();
              
              // If we found a solution and only want one, return
              if (success && solutions.length > 0) {
                return true;
              }
            }
          }
        }
      }
    }
    
    return false;
  }
  
  // Start the backtracking algorithm
  console.log(`Starting solver with ${pieces.length} pieces, board size: ${boardWidth}x${boardHeight}`);
  backtrack();
  console.log(`Solver finished. Total attempts: ${attempts}, Solutions found: ${solutions.length}`);
  
  return solutions;
} 