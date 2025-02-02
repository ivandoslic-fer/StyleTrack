import { SnackbarProvider } from "../context/SnackbarContext";
import TopAppBar from "./TopAppBar";
import { useEffect, useState } from "react";

export default function StyleTrackLayout({ children }) {
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    setIsAuthPage(window.location.pathname.includes('/register') || window.location.pathname.includes('/login'));
  }, []);

  return (
    <div className="w-full h-[100svh] p-0 m-0 bg-red">
      <SnackbarProvider>
        {!isAuthPage && <TopAppBar />}
        { children }
      </SnackbarProvider>
    </div>
  )
}
