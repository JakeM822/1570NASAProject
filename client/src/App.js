import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Browse from "./pages/Browse";
import Favorites from "./pages/Favorites";
import Orbit from "./pages/Orbit";
import Account from "./pages/Account";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/orbit" element={<Orbit />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
        </Routes>
        <div className="scanlines"></div>
        <div className="scanner"></div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
