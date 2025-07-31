import ChessboardComponent from "./components/ChessboardComponent";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ChessboardComponent />
    </main>
  );
}