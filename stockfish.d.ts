// This file is stockfish.d.ts

// First, we define the shape of the engine instance that the stockfish function returns.
// Making this interface available globally allows us to use it in our component.
interface StockfishInstance {
  postMessage(cmd: string): void;
  addEventListener(
    type: 'message',
    listener: (event: MessageEvent) => void
  ): void;
}

// Now, we declare the module 'stockfish' and specify its default export.
declare module 'stockfish' {
  // This says that the default export is a function that returns our StockfishInstance.
  export default function stockfish(): StockfishInstance;
}