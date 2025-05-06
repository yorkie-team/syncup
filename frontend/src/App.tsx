import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Event } from "./types/types";
import { CreateEventPage } from "./CreateEventPage";
import { EventDetailPage } from "./EventDetailPage";
import { ThemeProvider } from "./components/ThemeProvider";
import { Layout } from "./Layout";

function App() {
  const [eventData, setEventData] = useState<Event | undefined>(undefined);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter basename={import.meta.env.VITE_SYNCUP_BASENAME}>
        <Layout eventData={eventData}>
          <Routes>
            <Route path="/" element={<CreateEventPage />} />
            <Route
              path="/:key"
              element={<EventDetailPage onEventLoad={setEventData} />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
