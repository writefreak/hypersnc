// import { useCallback, useEffect, useState } from "react"; // CHANGED
// import Landing from "./pages/Landing.jsx";
// import Home from "./screens/Home.jsx";
// import Transfer from "./screens/Transfer.jsx";
// import { TOOL_PATH } from "./config.js";
// import usePeer from "./hooks/usePeer.js";

// console.log("path:", window.location.pathname, "TOOL_PATH:", TOOL_PATH);
// function Tool() {
//   const peer = usePeer(); // NEW: owned here so it survives screen changes
//   const { status, close } = peer;
//   const [screen, setScreen] = useState("home");

//   // CHANGED: leaving any screen also resets the connection
//   const goHome = useCallback(() => {
//     close();
//     setScreen("home");
//   }, [close]);

//   // NEW: move screens when the data channel opens or closes
//   useEffect(() => {
//     if (status === "connected") setScreen("transfer");
//     if (status === "disconnected") goHome();
//   }, [status, goHome]);

//   if (screen === "transfer") {
//     return <Transfer onDisconnect={goHome} />;
//   }

//   return (
//     <Home
//       screen={screen}
//       peer={peer} // NEW
//       onSend={() => setScreen("send")}
//       onReceive={() => setScreen("receive")}
//       onBack={goHome} // NEW
//       onConnected={() => setScreen("transfer")} // only used by the dev skip buttons now
//     />
//   );
// }

// export default function App() {
//   const isTool = window.location.pathname.startsWith(TOOL_PATH);
//   return isTool ? <Tool /> : <Landing />;
// }

import { useCallback, useEffect, useState } from "react"; // CHANGED: added useCallback, useEffect
import Landing from "./pages/Landing.jsx";
import Home from "./screens/Home.jsx";
import PairSend from "./screens/PairSend.jsx";
import PairReceive from "./screens/PairReceive.jsx";
import Transfer from "./screens/Transfer.jsx";
import { TOOL_PATH } from "./config.js";
import usePeer from "./hooks/usePeer.js"; // NEW

// function Tool() {
//   const [screen, setScreen] = useState("home");
//   const goHome = () => setScreen("home");
//   const goTransfer = () => setScreen("transfer");

//   switch (screen) {
//     case "send":
//       return <PairSend onBack={goHome} onConnected={goTransfer} />;
//     case "receive":
//       return <PairReceive onBack={goHome} onConnected={goTransfer} />;
//     case "transfer":
//       return <Transfer onDisconnect={goHome} />;
//     default:
//       return <Home onSend={() => setScreen("send")} onReceive={() => setScreen("receive")} />;
//   }
// }

function Tool() {
  const peer = usePeer(); // NEW: owned here so the connection survives screen changes
  const { status, close } = peer; // NEW
  const [screen, setScreen] = useState("home");
  const goTransfer = () => setScreen("transfer");

  // CHANGED: was `() => setScreen("home")`. Now it also closes the connection.
  const goHome = useCallback(() => {
    close();
    setScreen("home");
  }, [close]);

  // NEW: "home" and "send" are the same tab, so tapping the active tab does nothing.
  // Switching to the other tab resets the connection so stale codes never carry over.
  const currentTab = screen === "receive" ? "receive" : "send";
  const switchTab = (next) => {
    if (next === currentTab) return;
    close();
    setScreen(next);
  };

  // NEW: move screens when the data channel opens or closes
  useEffect(() => {
    if (status === "connected") setScreen("transfer");
    if (status === "disconnected") goHome();
  }, [status, goHome]);

  if (screen === "transfer") {
    return <Transfer onDisconnect={goHome} channel={peer.channel} />;
  }

  return (
    <Home
      screen={screen}
      peer={peer} // NEW
      onSend={() => switchTab("send")} // CHANGED
      onReceive={() => switchTab("receive")} // CHANGED
      onConnected={goTransfer} // only used by the dev skip buttons now
    />
  );
}

export default function App() {
  const isTool = window.location.pathname.startsWith(TOOL_PATH);
  return isTool ? <Tool /> : <Landing />;
}

// export default function App() {
//   return <Transfer onDisconnect={() => {}} />; // DEV ONLY
// }
