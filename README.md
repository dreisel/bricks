# Bricks Puzzle Solver

A React-based puzzle solver for 5×N board puzzles with 12 unique pieces. The solver uses a randomized backtracking algorithm to find solutions efficiently.

## Features

- **Interactive Piece Selection**: Click on pieces to select/deselect them
- **Dynamic Board Sizing**: Adjust board width from 3 to 13 columns
- **Randomized Algorithm**: Each solve attempt uses a different piece order for better performance
- **Real-time Validation**: Shows if your piece selection matches the board area
- **Solution Visualization**: Displays found solutions with colored piece placement

## How to Use

1. **Select Board Width**: Use the + and - buttons to adjust the board width
2. **Choose Pieces**: Click on pieces to select them. The total area must match the board area
3. **Solve**: Click "Solve Puzzle" to find solutions
4. **View Results**: Solutions are displayed with colored pieces showing their placement

## Technical Details

- Built with React + TypeScript + Vite
- Uses a randomized backtracking algorithm for puzzle solving
- Responsive design that works on desktop and mobile
- Automatic deployment to GitHub Pages

## Live Demo

Visit the live application at: [https://yourusername.github.io/bricks/](https://yourusername.github.io/bricks/)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT License
