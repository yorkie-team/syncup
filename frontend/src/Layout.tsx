import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/NavBar";
import { Event } from "./types/types";

type LayoutProps = {
  children: ReactNode;
  eventData?: Event;
};

export function Layout({ children, eventData }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar eventData={eventData} />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">{children}</div>
      </main>
      <footer className="border-t py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Yorkie Team. All rights reserved.
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
