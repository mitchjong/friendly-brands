"use client";

import { useEffect, useState } from "react";
import CatalogGate from "./CatalogGate";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or on mobile
    if (sessionStorage.getItem("exit_popup_dismissed")) return;
    if (window.innerWidth < 768) return;

    let triggered = false;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY < 10 && !triggered) {
        triggered = true;
        // Only show after 10 seconds on page
        setShow(true);

        // Track
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "exit_intent_shown", page: window.location.pathname }),
        }).catch(() => {});
      }
    }

    // Delay attaching the listener so it doesn't fire immediately
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  function handleClose() {
    setShow(false);
    sessionStorage.setItem("exit_popup_dismissed", "true");
  }

  return <CatalogGate open={show} onClose={handleClose} />;
}
