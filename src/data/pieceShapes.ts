// Piece shapes based on the original descriptions
// Each piece is defined as a 2D array where 1 = filled square, 0 = empty space
// All pieces are now encoded in square matrices for proper flip operations

export interface PieceShape {
  id: number;
  name: string;
  color: string;
  shape: number[][];
}

export const PIECE_SHAPES: PieceShape[] = [
  {
    id: 1,
    name: 'White',
    color: '#ffffff',
    shape: [
      [1, 1, 0],    // xx0
      [0, 1, 0],    // 0x0
      [0, 1, 1]     // 0xx
    ]
  },
  {
    id: 2,
    name: 'Yellow',
    color: '#ffd700',
    shape: [
      [1, 1, 0],    // xx0
      [0, 1, 0],    // 0x0
      [1, 1, 0]     // xx0
    ]
  },
  {
    id: 3,
    name: 'Light Orange',
    color: '#ffb347',
    shape: [
      [1, 0, 0, 0, 0],    // x0000
      [1, 0, 0, 0, 0],    // x0000
      [1, 0, 0, 0, 0],    // x0000
      [1, 0, 0, 0, 0],    // x0000
      [1, 0, 0, 0, 0]     // x0000
    ]
  },
  {
    id: 4,
    name: 'Blue',
    color: '#4169e1',
    shape: [
      [1, 0, 0],    // x00
      [1, 0, 0],    // x00
      [1, 1, 1]     // xxx
    ]
  },
  {
    id: 5,
    name: 'Brown',
    color: '#8b4513',
    shape: [
      [1, 0, 0, 0],    // x000
      [1, 0, 0, 0],    // x000
      [1, 1, 0, 0],    // xx00
      [1, 0, 0, 0]     // x000
    ]
  },
  {
    id: 6,
    name: 'Orange',
    color: '#ff8c00',
    shape: [
      [1, 0, 0, 0],    // x000
      [1, 0, 0, 0],    // x000
      [1, 0, 0, 0],    // x000
      [1, 1, 0, 0]     // xx00
    ]
  },
  {
    id: 7,
    name: 'Green',
    color: '#32cd32',
    shape: [
      [1, 0, 0],    // x00
      [1, 1, 1],    // xxx
      [1, 0, 0]     // x00
    ]
  },
  {
    id: 8,
    name: 'Pink',
    color: '#ff69b4',
    shape: [
      [1, 1, 0],    // xx0
      [0, 1, 1],    // 0xx
      [0, 0, 1]     // 00x
    ]
  },
  {
    id: 9,
    name: 'Red',
    color: '#dc143c',
    shape: [
      [0, 1, 0],    // 0x0
      [1, 1, 1],    // xxx
      [0, 1, 0]     // 0x0
    ]
  },
  {
    id: 10,
    name: 'Light Blue',
    color: '#87ceeb',
    shape: [
      [1, 1, 0],    // xx0
      [1, 1, 0],    // xx0
      [0, 1, 0]     // 0x0
    ]
  },
  {
    id: 11,
    name: 'Black',
    color: '#000000',
    shape: [
      [1, 0, 0, 0],    // x000
      [1, 1, 0, 0],    // xx00
      [0, 1, 0, 0],    // 0x00
      [0, 1, 0, 0]     // 0x00
    ]
  },
  {
    id: 12,
    name: 'Light Green',
    color: '#90ee90',
    shape: [
      [0, 1, 0],    // 0x0
      [1, 1, 1],    // xxx
      [1, 0, 0]     // x00
    ]
  }
];

// Helper function to get piece by ID
export function getPieceById(id: number): PieceShape | undefined {
  return PIECE_SHAPES.find(piece => piece.id === id);
}

// Helper function to get pieces by IDs
export function getPiecesByIds(ids: number[]): PieceShape[] {
  return PIECE_SHAPES.filter(piece => ids.includes(piece.id));
}

// Helper function to calculate area of a piece
export function getPieceArea(piece: PieceShape): number {
  return piece.shape.reduce((sum, row) => 
    sum + row.reduce((a, b) => a + b, 0), 0
  );
}

// Helper function to calculate total area of multiple pieces
export function getTotalArea(pieces: PieceShape[]): number {
  return pieces.reduce((sum, piece) => sum + getPieceArea(piece), 0);
} 