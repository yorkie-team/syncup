import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateEventView } from "./CreateEventView";
import { EventDetailView } from "./EventDetailView";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter basename={import.meta.env.VITE_SYNCUP_BASENAME}>
        <div className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<CreateEventView />} />
            <Route path="/:key" element={<EventDetailView />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
