"use client";

import { useState, useMemo, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard, type PieceDropHandlerArgs } from "react-chessboard";
import { Button } from "@/components/ui/button";

export default function ChessboardComponent() {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(
    null
  );
  const [suggestedMove, setSuggestedMove] = useState<string | null>(null);

  // **FIX: Use our custom StockfishInstance type instead of 'any'**
  const [engine, setEngine] = useState<StockfishInstance | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // This effect dynamically imports Stockfish on the client-side
  useEffect(() => {
    async function initEngine() {
      const stockfish = (await import("stockfish")).default;
      const sf = stockfish();
      setEngine(sf);

      sf.addEventListener("message", (event: MessageEvent) => {
        if (event.data?.startsWith("bestmove")) {
          const bestMove = event.data.split(" ")[1];
          setSuggestedMove(bestMove);
          setIsThinking(false);
        }
      });

      return () => {
        sf.postMessage("quit");
      };
    }
    initEngine();
  }, []); // Empty dependency array ensures this runs only once

  function onDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!sourceSquare || !targetSquare) return false;
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return false;
    setFen(game.fen());
    setSuggestedMove(null);
    return true;
  }

  async function handleSuggestMove() {
    if (!engine || isThinking) return;

    setIsThinking(true);
    engine.postMessage(`position fen ${game.fen()}`);
    engine.postMessage("go depth 15");
  }

  if (!playerColor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Select Your Side</h2>
        <div className="space-x-4">
          <Button onClick={() => setPlayerColor("white")}>
            I am playing as White
          </Button>
          <Button onClick={() => setPlayerColor("black")}>
            I am playing as Black
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-lg">
        <Chessboard
          options={{
            position: fen,
            boardOrientation: playerColor,
            onPieceDrop: onDrop,
            squareStyles: suggestedMove
              ? {
                  [suggestedMove.slice(0, 2)]: {
                    backgroundColor: "rgba(255, 255, 0, 0.4)",
                  },
                  [suggestedMove.slice(2, 4)]: {
                    backgroundColor: "rgba(255, 255, 0, 0.4)",
                  },
                }
              : {},
          }}
        />
      </div>
      <Button
        onClick={handleSuggestMove}
        className="mt-4"
        disabled={isThinking || !engine}
      >
        {!engine
          ? "Engine loading..."
          : isThinking
          ? "🤔 Thinking..."
          : "💡 Suggest Best Move"}
      </Button>
    </div>
  );
}
