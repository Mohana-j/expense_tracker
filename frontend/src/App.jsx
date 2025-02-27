import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Amount from "./pages/Amount";
import Home from "./pages/Home";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavFooter = ["/login", "/register"].includes(location.pathname); // ✅ Hide on Login & Register pages

  return (
    <>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> {/* ✅ No Navbar/Footer */}
          <Route path="/register" element={<Register />} /> {/* ✅ No Navbar/Footer */}
          <Route path="/amount" element={<Amount />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
