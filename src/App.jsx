import { useEffect } from "react";
import Puzzle15 from "./components/Slide15-mini";
import WebApp from "@twa-dev/sdk";

function App() {
  useEffect(() => {
    // Initialize Telegram WebApp API
    WebApp.ready();

    // Optionally set up other Telegram-specific behaviors
    // This signals the app is ready to Telegram
    if (WebApp.isExpanded === false) {
      WebApp.expand();
    }
  }, []);
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: `url("${import.meta.env.BASE_URL}background.jpg")`,
        // backgroundImage: 'url("/images/game15-background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* Top container with title */}
      <div className="w-full max-w-sm md:max-w-md bg-violet-800 rounded-t-lg p-4 md:p-6 text-center shadow-lg">
        {/* <div className="w-full max-w-sm md:max-w-md bg-violet-800 bg-opacity-90 rounded-t-lg p-4 md:p-6 text-center shadow-lg"> */}
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
          Игра 15
        </h1>
      </div>

      {/* Game container - just the puzzle board */}
      <div className="w-full max-w-sm md:max-w-md bg-violet-700 p-4 md:p-6 rounded-b-lg shadow-lg">
        {/* <div className="w-full max-w-sm md:max-w-md bg-violet-700 bg-opacity-90 p-4 md:p-6 rounded-b-lg shadow-lg"> */}
        <Puzzle15 />
      </div>
    </main>
  );
}

export default App;
