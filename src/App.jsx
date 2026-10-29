import { useState } from "react";
import Landing from "./pages/Landing.jsx";
import Home from "./screens/Home.jsx";
import PairSend from "./screens/PairSend.jsx";
import PairReceive from "./screens/PairReceive.jsx";
import Transfer from "./screens/Transfer.jsx";
import { TOOL_PATH } from "./config.js";

function Tool() {
  const [screen, setScreen] = useState("home");
  const goHome = () => setScreen("home");
  const goTransfer = () => setScreen("transfer");

  switch (screen) {
    case "send":
      return <PairSend onBack={goHome} onConnected={goTransfer} />;
    case "receive":
      return <PairReceive onBack={goHome} onConnected={goTransfer} />;
    case "transfer":
      return <Transfer onDisconnect={goHome} />;
    default:
      return <Home onSend={() => setScreen("send")} onReceive={() => setScreen("receive")} />;
  }
}

export default function App() {
  const isTool = window.location.pathname.startsWith(TOOL_PATH);
  return isTool ? <Tool /> : <Landing />;
}
