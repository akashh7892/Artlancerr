import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import IntroFlow from "./pages/IntroFlow";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
import HirerPayment from "./pages/hirer/HirerPayment";
import HirerPromotions from "./pages/hirer/HirerPromotions";
import HirerSettings from "./pages/hirer/HirerSettings";
import Booking from "./pages/hirer/Booking";
import PostRequirement from "./pages/hirer/PostRequirement";
import BrowseArtist from "./pages/hirer/Browseartist";
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

      {/* Artist routes — protected */}
      <Route path="/artist/dashboard" element={<ProtectedRoute requiredRole="artist"><Dashboard /></ProtectedRoute>} />
      <Route path="/artist/message" element={<ProtectedRoute requiredRole="artist"><Messages /></ProtectedRoute>} />
      <Route path="/artist/messages" element={<ProtectedRoute requiredRole="artist"><Messages /></ProtectedRoute>} />
      <Route path="/artist/near-by-artists" element={<ProtectedRoute requiredRole="artist"><Nearbyartists /></ProtectedRoute>} />
      <Route path="/artist/near-by-artists/:id" element={<ProtectedRoute requiredRole="artist"><ArtistProfileView /></ProtectedRoute>} />
      <Route path="/artist/opportunity" element={<ProtectedRoute requiredRole="artist"><Opportunities /></ProtectedRoute>} />
      <Route path="/artist/payment" element={<ProtectedRoute requiredRole="artist"><Payment /></ProtectedRoute>} />
      <Route path="/artist/plusicon" element={<ProtectedRoute requiredRole="artist"><Plusicon /></ProtectedRoute>} />
      <Route path="/artist/portfolio" element={<ProtectedRoute requiredRole="artist"><Portfolio /></ProtectedRoute>} />
      <Route path="/artist/profile" element={<ProtectedRoute requiredRole="artist"><Profile /></ProtectedRoute>} />
      <Route path="/artist/promotion" element={<ProtectedRoute requiredRole="artist"><Promotions /></ProtectedRoute>} />
      <Route path="/artist/settings" element={<ProtectedRoute requiredRole="artist"><Settings /></ProtectedRoute>} />

      {/* Hirer routes — protected */}
      <Route path="/hirer/dashboard" element={<ProtectedRoute requiredRole="hirer"><HirerDashboard /></ProtectedRoute>} />
      <Route path="/hirer/settings" element={<ProtectedRoute requiredRole="hirer"><HirerSettings /></ProtectedRoute>} />
      <Route path="/hirer/promotions" element={<ProtectedRoute requiredRole="hirer"><HirerPromotions /></ProtectedRoute>} />
      <Route path="/hirer/post-requirement" element={<ProtectedRoute requiredRole="hirer"><PostRequirement /></ProtectedRoute>} />
      <Route path="/hirer/browse-artists" element={<ProtectedRoute requiredRole="hirer"><BrowseArtist /></ProtectedRoute>} />
      <Route path="/hirer/browse-artists/:id" element={<ProtectedRoute requiredRole="hirer"><ArtistProfile /></ProtectedRoute>} />
      <Route path="/hirer/bookings" element={<ProtectedRoute requiredRole="hirer"><Booking /></ProtectedRoute>} />
      <Route path="/hirer/messages" element={<ProtectedRoute requiredRole="hirer"><HirerMessages /></ProtectedRoute>} />
      <Route path="/hirer/payments" element={<ProtectedRoute requiredRole="hirer"><HirerPayment /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
