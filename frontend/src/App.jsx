import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import IntroFlow from "./pages/IntroFlow";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOTP from "./components/auth/VerifyOTP";
import ResetPassword from "./components/auth/ResetPassword";
import Dashboard from "./pages/artist/Dashboard";
import Messages from "./pages/artist/Messages";
import Nearbyartists from "./pages/artist/Nearbyartists";
import Opportunity from "./pages/artist/Opportunity";
import Payment from "./pages/artist/Payment";
import Plusicon from "./pages/artist/Plusicon";
import Portfolio from "./pages/artist/Portfolio";
import Profile from "./pages/artist/Profile";
import Promotions from "./pages/artist/Promotions";
import Settings from "./pages/artist/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/intro" element={<IntroFlow />} />

      {/* Auth */}
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/verify-otp" element={<VerifyOTP />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* Artists */}
      <Route path="/artist/dashboard" element={<Dashboard />} />
      <Route path="/artist/message" element={<Messages />} />
      <Route path="/artist/near-by-artists" element={<Nearbyartists />} />
      <Route path="/artist/opportunity" element={<Opportunity />} />
      <Route path="/artist/payment" element={<Payment />} />
      <Route path="/artist/plusicon" element={<Plusicon />} />
      <Route path="/artist/portfolio" element={<Portfolio />} />
      <Route path="/artist/profile" element={<Profile />} />
      <Route path="/artist/promotion" element={<Promotions />} />
      <Route path="/artist/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
