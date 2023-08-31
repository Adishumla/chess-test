import React from "react";
import pieces from "../assets/fen.json";
import { motion } from "framer-motion";

interface SquareProps {
  black: boolean;
  children: React.ReactNode;
}

function Square(props: SquareProps) {
  const { black, children } = props;
  const backgroundColor = black ? "bg-gray-800" : "bg-white";
  const color = black ? "text-white" : "text-black";
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-full ${backgroundColor} ${color}`}
    >
      {children}
    </div>
  );
}

interface BoardProps {
  fen: string;
}

interface PieceProps {
  piece: string;
  x: number;
  y: number;
  onDragEnd: (x: number, y: number, newX: number, newY: number) => void;
}

function Piece(props: PieceProps) {
  const { piece, x, y, onDragEnd } = props;
  const pieces: Record<string, string> = require("../assets/fen.json");
  const pieceImage = pieces[piece as keyof typeof pieces];
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      dragMomentum={false}
      onDragEnd={(event, info) => {
        const newX = Math.round(x + info.offset.x / 50);
        const newY = Math.round(y + info.offset.y / 50);
        onDragEnd(x, y, newX, newY);
      }}
      whileHover={{ scale: 1.5 }}
      whileTap={{ scale: 0.9 }}
      className="w-12 h-12 flex items-center justify-center text-4xl"
      dangerouslySetInnerHTML={{ __html: pieces[piece] }}
    />
  );
}

function Board(props: BoardProps) {
  const { fen } = props;
  const [board, setBoard] = React.useState<string[][]>([]);

  React.useEffect(() => {
    const rows = fen.split(" ")[0].split("/");
    const newBoard = rows.map((row) => {
      const newRow = [];
      for (let i = 0; i < row.length; i++) {
        const char = row.charAt(i);
        if (isNaN(parseInt(char))) {
          newRow.push(char);
        } else {
          for (let j = 0; j < parseInt(char); j++) {
            newRow.push("");
          }
        }
      }
      return newRow;
    });
    setBoard(newBoard);
  }, [fen]);

  const handleDragEnd = (x: number, y: number, newX: number, newY: number) => {
    const newBoard = [...board];
    newBoard[newY][newX] = newBoard[y][x];
    newBoard[y][x] = "";
    setBoard(newBoard);
  };

  const handleReset = () => {
    setBoard([]);
    setTimeout(() => {
      setBoard(
        fen
          .split(" ")[0]
          .split("/")
          .map((row) => row.split(""))
      );
    }, 0);
  };

  const squares = [];
  if (board.length > 0) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        const black = (i + j) % 2 === 1;
        squares.push(
          <Square key={`${i}-${j}`} black={black}>
            {piece && (
              <Piece piece={piece} x={j} y={i} onDragEnd={handleDragEnd} />
            )}
          </Square>
        );
      }
    }
  }

  return (
    <div className="w-[400px] h-[400px] grid grid-cols-8 grid-rows-8">
      {squares}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="col-start-1 col-end-9 row-start-9 row-end-10 bg-slate-800 text-white p-2 mt-2 rounded-full"
        onClick={handleReset}
      >
        New Game
      </motion.button>
    </div>
  );
}

export default Board;
