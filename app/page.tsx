import { PhotoRestorer } from "./components/PhotoRestorer";
import { Navbar } from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 pt-26 pb-8">
        <PhotoRestorer />
      </main>
    </div>
  );
}
