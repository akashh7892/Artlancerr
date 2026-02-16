import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import IntroFlow from "./pages/IntroFlow";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOTP from "./components/auth/VerifyOTP";
import ResetPassword from "./components/auth/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/intro" element={<IntroFlow />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/verify-otp" element={<VerifyOTP />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
