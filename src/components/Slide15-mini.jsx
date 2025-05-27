import { useState, useEffect } from "react";
import { initTelegramNavigation } from "./return2Telegram"; // Add this import

export default function Puzzle15() {
  // Game state
  const [board, setBoard] = useState([]);
  const [emptyPos, setEmptyPos] = useState({ row: 3, col: 3 });
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);
  const [showClickEffect, setShowClickEffect] = useState(false);

  // Initialize board on first render
  useEffect(() => {
    initBoard();
  }, []);

  // Just back arrow navigation
  useEffect(() => {
    const cleanup = initTelegramNavigation();
    return cleanup;
  }, []);

  // Function to create a new shuffled board
  const initBoard = () => {
    // Create a solved board first
    let newBoard = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    let value = 1;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (row === 3 && col === 3) {
          newBoard[row][col] = 0; // Empty space
        } else {
          newBoard[row][col] = value++;
        }
      }
    }

    // Shuffle the board (ensuring it's solvable)
    shuffleBoard(newBoard);

    setBoard(newBoard);
    setMoves(0);
    setIsSolved(false);
  };

  // Shuffle the board (making sure it's solvable)
  const shuffleBoard = (board) => {
    let flatBoard = board.flat();
    let iterations = 1000; // Number of random moves to make

    // Find position of empty tile (0)
    let emptyIdx = flatBoard.indexOf(0);
    let emptyRow = Math.floor(emptyIdx / 4);
    let emptyCol = emptyIdx % 4;

    // Perform random valid moves
    for (let i = 0; i < iterations; i++) {
      // Get possible moves (up, down, left, right)
      const possibleMoves = [];

      if (emptyRow > 0) possibleMoves.push([-1, 0]); // up
      if (emptyRow < 3) possibleMoves.push([1, 0]); // down
      if (emptyCol > 0) possibleMoves.push([0, -1]); // left
      if (emptyCol < 3) possibleMoves.push([0, 1]); // right

      // Choose a random move
      const [dRow, dCol] =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // Move the tile
      const newRow = emptyRow + dRow;
      const newCol = emptyCol + dCol;

      // Swap the tiles
      board[emptyRow][emptyCol] = board[newRow][newCol];
      board[newRow][newCol] = 0;

      // Update empty position
      emptyRow = newRow;
      emptyCol = newCol;
    }

    setEmptyPos({ row: emptyRow, col: emptyCol });
  };

  // Handle tile click
  const handleTileClick = (row, col) => {
    if (isSolved) return;

    // Check if the clicked tile is adjacent to the empty space
    if (
      (Math.abs(row - emptyPos.row) === 1 && col === emptyPos.col) ||
      (Math.abs(col - emptyPos.col) === 1 && row === emptyPos.row)
    ) {
      // Store the clicked tile value (for the effect)
      const clickedValue = board[row][col];

      // First, show the pulsing circle on the clicked tile (before it moves)
      setLastClicked({ row, col, value: clickedValue });
      setShowClickEffect(true);

      // Delay the tile movement to allow the pulsing effect to be seen
      setTimeout(() => {
        // Create a deep copy of the board
        const newBoard = JSON.parse(JSON.stringify(board));

        // Swap the clicked tile with the empty space
        newBoard[emptyPos.row][emptyPos.col] = clickedValue;
        newBoard[row][col] = 0;

        // Update state
        setBoard(newBoard);
        setEmptyPos({ row, col });
        setMoves(moves + 1);

        // Check if the puzzle is solved
        checkIfSolved(newBoard);

        // Hide the effect shortly after the move
        setTimeout(() => {
          setShowClickEffect(false);
        }, 300);
      }, 300);
    }
  };

  // Check if the board is in the solved state
  const checkIfSolved = (board) => {
    let value = 1;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (row === 3 && col === 3) {
          if (board[row][col] !== 0) return;
        } else if (board[row][col] !== value++) {
          return;
        }
      }
    }
    setIsSolved(true);
    setShowConfetti(true);
    // Hide confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  // Add a new reset function
  const resetGame = () => {
    initBoard();
    setIsSolved(false);
    setShowConfetti(false);
  };

  // Implement a simple confetti effect
  const renderConfetti = () => {
    return Array(50)
      .fill()
      .map((_, i) => {
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 2;
        const background = [
          "bg-red-500",
          "bg-blue-500",
          "bg-green-500",
          "bg-yellow-500",
          "bg-purple-500",
          "bg-pink-500",
        ][Math.floor(Math.random() * 6)];

        return (
          <div
            key={i}
            className={`absolute rounded-full ${background} opacity-70`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: "-20px",
              animation: `confetti ${animationDuration}s ease-in ${animationDelay}s forwards`,
            }}
          />
        );
      });
  };

  return (
    <>
      {/* CSS animations */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        @keyframes clickPulse {
          0% {
            transform: scale(0.3);
            opacity: 0.9;
          }
          80% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .click-effect {
          animation: clickPulse 0.5s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center relative">
        {/* Game board */}
        <div className="grid grid-cols-4 gap-1 md:gap-2 bg-gray-800 p-3 md:p-4 rounded-lg shadow-inner">
          {board.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 md:w-16 md:h-16 flex items-center justify-center 
                  font-bold text-lg md:text-xl rounded cursor-pointer 
                  transition-all duration-200 relative shadow-md
                  ${isSolved ? "animate-pulse" : ""}
                  ${
                    tile === 0
                      ? "bg-gray-400 bg-opacity-30"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  }
                  ${
                    (Math.abs(rowIndex - emptyPos.row) === 1 &&
                      colIndex === emptyPos.col) ||
                    (Math.abs(colIndex - emptyPos.col) === 1 &&
                      rowIndex === emptyPos.row)
                      ? "ring-2 ring-red-400 ring-opacity-80"
                      : ""
                  }
                `}
                onClick={() => handleTileClick(rowIndex, colIndex)}
              >
                {tile !== 0 && tile}

                {/* Click effect */}
                {showClickEffect &&
                  lastClicked &&
                  lastClicked.row === rowIndex &&
                  lastClicked.col === colIndex &&
                  tile === lastClicked.value && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500 click-effect"></div>
                    </div>
                  )}
              </div>
            ))
          )}
          {/* Confetti effect */}
          {showConfetti && renderConfetti()}
        </div>

        {/* Stats and buttons */}
        <div className="mt-4 md:mt-6 flex flex-col items-center gap-3">
          <p className="text-lg md:text-xl text-white font-semibold drop-shadow-md bg-violet-800 px-3 py-1 rounded">
            Ходов: {moves}
          </p>
          <button
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            onClick={resetGame}
          >
            Новая игра
          </button>
        </div>

        {/* Congratulations Modal */}
        {isSolved && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl text-center max-w-sm md:max-w-md w-full">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-600">
                Congratulations! 🎉
              </h2>
              <p className="text-lg md:text-xl mb-6">
                Вы решили загадку за {moves} ходов!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={resetGame}
                >
                  Играть снова
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setIsSolved(false)}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
