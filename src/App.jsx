import { useState } from "react";
import Home from "./screens/Home.jsx";
import PairSend from "./screens/PairSend.jsx";
import PairReceive from "./screens/PairReceive.jsx";
import Transfer from "./screens/Transfer.jsx";

export default function App() {
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
