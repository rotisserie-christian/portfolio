import { Outlet } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";

function App() {
  return (
    <div className="min-h-screen flex-1 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default App
