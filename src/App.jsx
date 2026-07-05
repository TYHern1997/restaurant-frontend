import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage";
import BookingsPage from './pages/BookingsPage'
import "bootstrap/dist/css/bootstrap.min.css";
import MyBookingsPage from './pages/MyBookingsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/signup" element={<AuthPage startAsSignup={true} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;