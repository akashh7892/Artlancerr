import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import IntroFlow from "./pages/IntroFlow";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/intro" element={<IntroFlow />} />
    </Routes>
  );
}

export default App;
