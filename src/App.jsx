import { Outlet } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <main className="w-full">
        <Outlet />
      </main>
    </>
  )
}

export default App
