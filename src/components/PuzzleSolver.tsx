import React, { useState, useEffect } from 'react';
import {
  solvePuzzle,
  generatePieceVariations,
  type Solution
} from '../utils/newPuzzleSolver';
import { PIECE_SHAPES, getPiecesByIds, getTotalArea } from '../data/pieceShapes';
import './PuzzleSolver.css';

const PuzzleSolver: React.FC = () => {
  const [boardWidth, setBoardWidth] = useState(() => {
    const saved = localStorage.getItem('bricks-board-width');
    return saved ? parseInt(saved) : 5;
  });

  const [selectedPieces, setSelectedPieces] = useState<number[]>(() => {
    const saved = localStorage.getItem('bricks-selected-pieces');
    return saved ? JSON.parse(saved) : [];
  });

  const [solutions, setSolutions] = useState<Solution[][]>([]);
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState<string>('');
  const [solveStats, setSolveStats] = useState<{
    timeMs: number;
    attempts: number;
  } | null>(null);

  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem('bricks-board-width', boardWidth.toString());
  }, [boardWidth]);

  useEffect(() => {
    localStorage.setItem('bricks-selected-pieces', JSON.stringify(selectedPieces));
  }, [selectedPieces]);

  const togglePiece = (pieceId: number) => {
    setSelectedPieces(prev =>
      prev.includes(pieceId)
        ? prev.filter(id => id !== pieceId)
        : [...prev, pieceId]
    );
    setError('');
  };

  const solvePuzzleHandler = () => {
    if (selectedPieces.length === 0) {
      setError('Please select at least one piece!');
      return;
    }

    const selectedPieceObjects = getPiecesByIds(selectedPieces);
    const totalArea = getTotalArea(selectedPieceObjects);
    const boardArea = boardWidth * 5;

    if (totalArea !== boardArea) {
      setError(`Selected pieces have ${totalArea} squares, but board needs ${boardArea} squares. Please adjust your selection.`);
      return;
    }

    setIsSolving(true);
    setSolutions([]);
    setError('');
    setSolveStats(null);

    const startTime = performance.now();

    setTimeout(() => {
      try {
        let attempts = 0;
        const originalLog = console.log;
        console.log = (...args) => {
          if (args[0] && typeof args[0] === 'string' && args[0].includes('Attempts:')) {
            attempts = parseInt(args[0].split('Attempts: ')[1].split(',')[0]);
          }
          originalLog.apply(console, args);
        };

        const foundSolutions = solvePuzzle(selectedPieceObjects, boardWidth, 5);
        console.log = originalLog;

        const endTime = performance.now();
        const timeMs = Math.round(endTime - startTime);

        setSolutions(foundSolutions);
        setSolveStats({ timeMs, attempts });
        setHintIndex(0); // Reset hint state

        if (foundSolutions.length === 0) {
          setError('No solutions found for this combination of pieces and board size.');
        }
      } catch (error) {
        setError('An error occurred while solving the puzzle. Please try again.');
        console.error('Puzzle solving error:', error);
      } finally {
        setIsSolving(false);
      }
    }, 100);
  };

  const renderBoard = (solution: Solution[]) => {
    const board = Array(5).fill(null).map(() => Array(boardWidth).fill(0));

    solution.slice(0, hintIndex).forEach(({ pieceId, x, y, rotation, flipped }) => {
      const piece = PIECE_SHAPES.find(p => p.id === pieceId);
      if (piece) {
        const variations = generatePieceVariations(piece);
        const variation = variations.find(v =>
          v.rotation === rotation && v.flipped === flipped
        );

        const shape = variation ? variation.shape : piece.shape;

        shape.forEach((row, dy) => {
          row.forEach((cell, dx) => {
            if (cell && y + dy < 5 && x + dx < boardWidth) {
              board[y + dy][x + dx] = pieceId;
            }
          });
        });
      }
    });

    return (
      <div className="board" style={{ gridTemplateColumns: `repeat(${boardWidth}, 1fr)` }}>
        {board.flat().map((cell, index) => (
          <div
            key={index}
            className={`board-cell ${cell ? 'filled' : ''}`}
            style={cell ? { backgroundColor: PIECE_SHAPES.find(p => p.id === cell)?.color } : {}}
          />
        ))}
      </div>
    );
  };

  const selectedPieceObjects = getPiecesByIds(selectedPieces);
  const totalArea = getTotalArea(selectedPieceObjects);
  const boardArea = boardWidth * 5;
  const isValidSelection = totalArea === boardArea;

  return (
    <div className="puzzle-solver">
      <h2>Puzzle Solver</h2>

      <div className="controls">
        <div className="board-width-control">
          <label>Board Width (3-13):</label>
          <div className="width-control">
            <button
              className="width-btn"
              onClick={() => setBoardWidth(prev => Math.max(3, prev - 1))}
              disabled={boardWidth <= 3}
            >
              −
            </button>
            <span className="width-display">{boardWidth}</span>
            <button
              className="width-btn"
              onClick={() => setBoardWidth(prev => Math.min(13, prev + 1))}
              disabled={boardWidth >= 13}
            >
              +
            </button>
          </div>
          <div className="board-info">
            <span>Board Size: 5 × {boardWidth} = {boardArea} squares</span>
            <span>Selected Area: {totalArea} squares</span>
            {!isValidSelection && selectedPieces.length > 0 && (
              <span className="area-warning">
                {totalArea > boardArea ? 'Too many squares!' : 'Not enough squares!'}
              </span>
            )}
          </div>
        </div>

        <div className="piece-selection">
          <h3>Select Pieces:</h3>
          <div className="pieces-grid">
            {PIECE_SHAPES.map(piece => (
              <div
                key={piece.id}
                className={`piece-item ${selectedPieces.includes(piece.id) ? 'selected' : ''}`}
                onClick={() => togglePiece(piece.id)}
              >
                <div className="piece-preview">
                  {piece.shape.map((row, y) => (
                    <div key={y} className="piece-row">
                      {row.map((cell, x) => (
                        <div
                          key={x}
                          className={`piece-cell ${cell ? 'filled' : ''}`}
                          style={cell ? { backgroundColor: piece.color } : {}}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <span className="piece-name">{piece.name}</span>
                <span className="piece-area">({getTotalArea([piece])} squares)</span>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <button
          className="solve-button"
          onClick={solvePuzzleHandler}
          disabled={isSolving || selectedPieces.length === 0 || !isValidSelection}
        >
          {isSolving ? 'Solving...' : 'Solve Puzzle'}
        </button>

        {isSolving && (
          <div className="solving-animation">
            <div className="spinner"></div>
            <p>Solving puzzle...</p>
          </div>
        )}

        {solveStats && (
          <div className="solve-stats">
            <p>⏱️ Time: {solveStats.timeMs}ms</p>
            <p>🔍 Attempts: {solveStats.attempts.toLocaleString()}</p>
          </div>
        )}
      </div>

      {solutions.length > 0 && (
        <div className="solutions">
          <h3>Solution Found</h3>
          <div className="hint-controls">
            <button
              onClick={() => setHintIndex(prev => Math.min(prev + 1, solutions[0].length))}
              disabled={hintIndex >= solutions[0].length}
            >
              Show Next Hint
            </button>
            <p>{hintIndex} / {solutions[0].length} pieces revealed</p>
          </div>
          <div className="solution">
            {renderBoard(solutions[0])}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleSolver;