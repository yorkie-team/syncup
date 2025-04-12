import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateEventView } from "./CreateEventView";
import { EventDetailView, Event } from "./EventDetailView";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/navbar";
import { useState } from "react";

function App() {
  const [eventData, setEventData] = useState<Event | undefined>(undefined);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter basename={import.meta.env.VITE_SYNCUP_BASENAME}>
        <div className="min-h-screen flex flex-col">
          <Navbar eventData={eventData} />
          <main className="flex-1 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <Routes>
                <Route path="/" element={<CreateEventView />} />
                <Route
                  path="/:key"
                  element={<EventDetailView onEventLoad={setEventData} />}
                />
              </Routes>
            </div>
          </main>
          <footer className="border-t py-4">
            <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Yorkie Team. All rights reserved.
            </div>
          </footer>
          <Toaster />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
