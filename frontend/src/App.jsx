import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import IntroFlow from "./pages/IntroFlow";

// Auth components (role‑aware)
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOTP from "./components/auth/VerifyOTP";
import ResetPassword from "./components/auth/ResetPassword";

// Artist pages
import Dashboard from "./pages/artist/Dashboard";
import Messages from "./pages/artist/Messages";
import Nearbyartists from "./pages/artist/Nearbyartists";
import Payment from "./pages/artist/Payment";
import Plusicon from "./pages/artist/Plusicon";
import Portfolio from "./pages/artist/Portfolio";
import Profile from "./pages/artist/Profile";
import Promotions from "./pages/artist/Promotions";
import Settings from "./pages/artist/Settings";
import ArtistProfileView from "./pages/artist/Artistviewprofile";
import Opportunities from "./pages/artist/Opportunity";

// Hirer pages
import HirerDashboard from "./pages/hirer/HirerDashboard";
import HirerMessages from "./pages/hirer/HirerMessages";
// import HirerPayment from "./pages/hirer/HirerPayment";
// import HirerPlusicon from "./pages/hirer/HirerPlusicon";
import HirerPromotions from "./pages/hirer/HirerPromotions";
import HirerSettings from "./pages/hirer/HirerSettings";
import Booking from "./pages/hirer/Booking";
import PostRequirement from "./pages/hirer/PostRequirement";
import BrowseArtist from "./pages/hirer/BrowseArtist";
import ArtistProfile from "./pages/hirer/ArtistProfile";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/intro/:role" element={<IntroFlow />} />

      {/* Auth role in URL */}
      <Route path="/auth/:role/signup" element={<Signup />} />
      <Route path="/auth/:role/login" element={<Login />} />
      <Route path="/auth/:role/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/:role/verify-otp" element={<VerifyOTP />} />
      <Route path="/auth/:role/reset-password" element={<ResetPassword />} />

      {/* Artist routes */}
      <Route path="/artist/dashboard" element={<Dashboard />} />
      <Route path="/artist/message" element={<Messages />} />
      <Route path="/artist/messages" element={<Messages />} />
      <Route path="/artist/near-by-artists" element={<Nearbyartists />} />
      <Route
        path="/artist/near-by-artists/:id"
        element={<ArtistProfileView />}
      />
      <Route path="/artist/opportunity" element={<Opportunities />} />
      <Route path="/artist/payment" element={<Payment />} />
      <Route path="/artist/plusicon" element={<Plusicon />} />
      <Route path="/artist/portfolio" element={<Portfolio />} />
      <Route path="/artist/profile" element={<Profile />} />
      <Route path="/artist/promotion" element={<Promotions />} />
      <Route path="/artist/settings" element={<Settings />} />

      {/* Hirer routes */}
      <Route path="/hirer/dashboard" element={<HirerDashboard />} />
      <Route path="/hirer/settings" element={<HirerSettings />} />
      <Route path="/hirer/promotions" element={<HirerPromotions />} />
      <Route path="/hirer/post-requirement" element={<PostRequirement />} />
      <Route path="/hirer/browse-artists" element={<BrowseArtist />} />
      <Route path="/hirer/browse-artists/:id" element={<ArtistProfile />} />
      <Route path="/hirer/bookings" element={<Booking />} />
      <Route path="/hirer/messages" element={<HirerMessages />} />
      {/* <Route path="/hirer/payment" element={<HirerPayment />} /> */}
    </Routes>
  );
}

export default App;
